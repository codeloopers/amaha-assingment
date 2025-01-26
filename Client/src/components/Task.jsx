import React from 'react';
import axios from 'axios';

const Task = ({ task, columnId, token, fetchBoard }) => {
  const removeTask = async () => {
    await axios.delete(`http://localhost:5000/api/board/task`, {
      data: { columnId, taskId: task._id },
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchBoard();
  };

  return (
    <div className="task">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <small>Due: {task.dueDate}</small>
      <button onClick={removeTask}>Remove</button>
    </div>
  );
};

export default Task;
