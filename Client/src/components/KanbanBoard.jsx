import React, { useState } from 'react';
import { FaTrashAlt, FaEdit, FaSearch, FaMoon, FaSun, FaSignOutAlt } from 'react-icons/fa';
import TaskModal from './TaskModal';
import './KanbanBoard.css';

const users = [
  { id: 1, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, name: 'Alice Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
];

const KanbanBoard = () => {
  const [columns, setColumns] = useState([
    { id: 1, name: 'Open', tasks: [] },
    { id: 2, name: 'In Progress', tasks: [] },
    { id: 3, name: 'In Review', tasks: [] },
    { id: 4, name: 'Completed', tasks: [] },
  ]);

  const [newColumnName, setNewColumnName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    columnId: null,
    assignedUserId: null,
    priority: 'Medium',
  });

  const handleAddColumn = () => {
    if (newColumnName.trim() !== '') {
      const newColumn = {
        id: Date.now(),
        name: newColumnName,
        tasks: [],
      };
      setColumns([...columns, newColumn]);
      setNewColumnName('');
    }
  };

  const handleLogout = () => {
    alert('You have been logged out!');
    window.location.href = '/login'; 
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
  };

  const openTaskForm = (columnId) => {
    setTaskFormData({
      ...taskFormData,
      columnId: columnId,
    });
    setIsTaskFormOpen(true);
  };

  const closeTaskForm = () => {
    setIsTaskFormOpen(false);
    setTaskFormData({ title: '', description: '', dueDate: '', columnId: null, assignedUserId: null, priority: 'Medium' });
  };

  const getPriorityClass = (priority) => {
    if (priority === 'High') return 'high-priority';
    if (priority === 'Medium') return 'medium-priority';
    return 'low-priority';
  };

  const getInitials = (userId) => {
    const user = users.find((user) => user.id === userId);
    return user ? user.name.split(' ').map((name) => name[0]).join('') : '';
  };

  const handleDrop = (e, columnId, taskId) => {
    const taskData = JSON.parse(e.dataTransfer.getData('task'));
    const { id, columnId: sourceColumnId } = taskData;

    if (sourceColumnId !== columnId) {
      setColumns((prevColumns) =>
        prevColumns.map((col) => {
          if (col.id === sourceColumnId) {
            return {
              ...col,
              tasks: col.tasks.filter((task) => task.id !== id),
            };
          }
          if (col.id === columnId) {
            return {
              ...col,
              tasks: [
                ...col.tasks,
                { ...taskData, columnId: columnId },
              ],
            };
          }
          return col;
        })
      );
    }
  };

  return (
    <div className={`kanban-board ${isDarkMode ? 'dark' : ''}`}>
      <nav className="navbar">
        <div className="navbar-left">
          <h1>Kanban Board</h1>
        </div>
        <div className="navbar-right">
          <input
            type="text"
            value={newColumnName}
            onChange={(e) => setNewColumnName(e.target.value)}
            placeholder="Enter column name"
            className="navbar-input"
          />
          <button onClick={handleAddColumn} className="navbar-add">
            Add Column
          </button>
          <button className="navbar-icon">
            <FaSearch />
          </button>
          <button onClick={toggleTheme} className="navbar-icon">
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
          <button onClick={handleLogout} className="navbar-icon logout-button">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </nav>

      <div className="columns">
        {columns.map((column) => (
          <div
            className="column"
            key={column.id}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className="column-header">
              <span>{column.name}</span>
              <div className="column-actions">
                {column.name === 'Open' && (
                  <button
                    onClick={() => openTaskForm(column.id)}
                    className="add-task-button"
                  >
                    Add Task
                  </button>
                )}
                <button
                  onClick={() =>
                    setColumns(columns.filter((col) => col.id !== column.id))
                  }
                  className="delete-column"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
            <ul className="task-list">
              {column.tasks.map((task) => (
                <li
                  key={task.id}
                  className={`task-card ${getPriorityClass(task.priority)}`}
                  draggable
                  onDragStart={(e) =>
                    e.dataTransfer.setData(
                      'task',
                      JSON.stringify({ ...task, columnId: column.id })
                    )
                  }
                >
                  <div className="task-header">
                    <strong>{task.title}</strong>
                    <span className="priority-label">{task.priority}</span>
                  </div>

                  <p className="task-description">{task.description}</p>
                  <small className="due-date">Due: {task.dueDate}</small>

                  {task.assignedUserId && (
                    <div className="assigned-user">
                      <span className="assigned-user-initials">
                        {getInitials(task.assignedUserId)}
                      </span>
                    </div>
                  )}
                  <div
                    className="task-column-name"
                    style={{
                      color: column.id === task.columnId ? '#4CAF50' : '#FF5733',
                    }}
                  >
                    <small>{column.name}</small>
                  </div>

                  <div className="task-actions">
                    <button
                      onClick={() => {
                        const updatedTask = {
                          ...task,
                          title: prompt('Edit task title:', task.title) || task.title,
                        };
                        setColumns(
                          columns.map((col) =>
                            col.id === column.id
                              ? {
                                  ...col,
                                  tasks: col.tasks.map((t) =>
                                    t.id === task.id ? updatedTask : t
                                  ),
                                }
                              : col
                          )
                        );
                      }}
                      className="edit-task"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() =>
                        setColumns(
                          columns.map((col) =>
                            col.id === column.id
                              ? {
                                  ...col,
                                  tasks: col.tasks.filter((t) => t.id !== task.id),
                                }
                              : col
                          )
                        )
                      }
                      className="delete-task"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <TaskModal
        isOpen={isTaskFormOpen}
        taskFormData={taskFormData}
        setTaskFormData={setTaskFormData}
        handleAddTask={() => {
          const { title, description, dueDate, columnId, assignedUserId, priority } = taskFormData;
          if (title.trim() !== '') {
            setColumns(
              columns.map((col) =>
                col.id === columnId
                  ? {
                      ...col,
                      tasks: [
                        ...col.tasks,
                        {
                          id: Date.now(),
                          title,
                          description,
                          dueDate,
                          assignedUserId,
                          priority,
                        },
                      ],
                    }
                  : col
              )
            );
          }
          closeTaskForm();
        }}
        closeTaskForm={closeTaskForm}
        users={users}
      />
    </div>
  );
};

export default KanbanBoard;
