const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();
var cors = require('cors');

// Define the allowed origin
const allowedOrigins = ['https://amaha-assingment.vercel.app'];

// Use CORS with specific origin
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET, PUT, POST, DELETE',
    allowedHeaders: 'Content-Type',
  })
);

app.options('*', cors());

app.use(express.json());

// Constants
const PORT = process.env.PORT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/kanban';

// MongoDB Models
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  assignedTo: { type: String },
});

const columnSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tasks: [taskSchema],
});

const boardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  columns: [columnSchema],
}, { timestamps: true });

const Board = mongoose.model('Board', boardSchema);

// Routes
// User Authentication
app.post('/api/users/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const newUser = await User.create({ name, email, password });
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: newUser._id, name, email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Kanban Board
app.get('/api/board/:userId', async (req, res) => {
  try {
    const board = await Board.findOne({ userId: req.params.userId });
    res.json(board || { columns: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/board/column', async (req, res) => {
  const { userId, title } = req.body;
  try {
    let board = await Board.findOne({ userId });
    if (!board) {
      board = await Board.create({ userId, columns: [] });
    }
    board.columns.push({ title, tasks: [] });
    await board.save();
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/board/task', async (req, res) => {
  const { userId, columnId, task } = req.body;
  try {
    const board = await Board.findOne({ userId });
    const column = board.columns.id(columnId);
    column.tasks.push(task);
    await board.save();
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/api/board/task', async (req, res) => {
  const { userId, columnId, taskId, updatedTask } = req.body;
  try {
    const board = await Board.findOne({ userId });
    const column = board.columns.id(columnId);
    const task = column.tasks.id(taskId);
    Object.assign(task, updatedTask);
    await board.save();
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.delete('/api/board/task', async (req, res) => {
  const { userId, columnId, taskId } = req.body;
  try {
    const board = await Board.findOne({ userId });
    const column = board.columns.id(columnId);
    column.tasks.id(taskId).remove();
    await board.save();
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// MongoDB Connection
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error(`Error: ${error.message}`));

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
