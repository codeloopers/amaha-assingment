import React from 'react';
import './TaskModal.css';

const TaskModal = ({
  isOpen,
  taskFormData,
  setTaskFormData,
  handleAddTask,
  closeTaskForm,
  users,
}) => {
  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!taskFormData.title || !taskFormData.description || !taskFormData.dueDate || !taskFormData.priority) {
      alert('All fields are mandatory!');
      return;
    }
    handleAddTask();
  };

  return (
    <div className="task-modal-overlay">
      <div className="task-modal">
        <h2>Add Task</h2>

        <input
          type="text"
          value={taskFormData.title}
          onChange={(e) =>
            setTaskFormData({ ...taskFormData, title: e.target.value })
          }
          placeholder="Task Title"
          required
        />

        <textarea
          value={taskFormData.description}
          onChange={(e) =>
            setTaskFormData({ ...taskFormData, description: e.target.value })
          }
          placeholder="Task Description"
          required
        />

        <input
          type="date"
          value={taskFormData.dueDate}
          onChange={(e) =>
            setTaskFormData({ ...taskFormData, dueDate: e.target.value })
          }
          required
        />

        <div className="priority-section">
          <p>Select Priority:</p>
          <div className="priority-options">
            <label
              className={`priority-option high-priority ${
                taskFormData.priority === 'High' ? 'active' : ''
              }`}
            >
              <input
                type="radio"
                name="priority"
                value="High"
                checked={taskFormData.priority === 'High'}
                onChange={(e) =>
                  setTaskFormData({ ...taskFormData, priority: e.target.value })
                }
                required
              />
              High
            </label>
            <label
              className={`priority-option medium-priority ${
                taskFormData.priority === 'Medium' ? 'active' : ''
              }`}
            >
              <input
                type="radio"
                name="priority"
                value="Medium"
                checked={taskFormData.priority === 'Medium'}
                onChange={(e) =>
                  setTaskFormData({ ...taskFormData, priority: e.target.value })
                }
                required
              />
              Medium
            </label>
            <label
              className={`priority-option low-priority ${
                taskFormData.priority === 'Low' ? 'active' : ''
              }`}
            >
              <input
                type="radio"
                name="priority"
                value="Low"
                checked={taskFormData.priority === 'Low'}
                onChange={(e) =>
                  setTaskFormData({ ...taskFormData, priority: e.target.value })
                }
                required
              />
              Low
            </label>
          </div>
        </div>

        <div className="assign-user-section">
          <p>Assign User:</p>
          <select
            value={taskFormData.assignedUser || ''}
            onChange={(e) =>
              setTaskFormData({ ...taskFormData, assignedUser: e.target.value })
            }
          >
            <option value="">Select User</option>
            {users && users.length > 0 ? (
              users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))
            ) : (
              <option disabled>No users available</option>
            )}
          </select>
        </div>

        <div className="task-modal-actions">
          <button className="add-task-btn" onClick={handleSubmit}>
            Add Task
          </button>
          <button className="cancel-btn" onClick={closeTaskForm}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
