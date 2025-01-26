# Kanban Board Application

## Description

This Kanban board application allows users to manage tasks in a visual way by organizing them into columns such as "To Do," "In Progress," and "Completed." Users can add tasks, edit them, delete them, and move them between columns. The board provides an intuitive interface for tracking progress, making it easier for teams to collaborate and stay on top of tasks.

## Features Implemented

### 1. **User Authentication**
   - Users can sign up and log in to access the Kanban board.
   - The application uses JWT (JSON Web Token) for secure authentication.

### 2. **Task Management**
   - Users can add tasks with a title, description, and due date.
   - Tasks can be assigned priorities (High, Medium, Low).
   - Users can assign tasks to other users (from a list of users).
   - Tasks can be edited or deleted.

### 3. **Drag and Drop Task Movement**
   - Tasks can be moved between columns using drag-and-drop functionality.
   - Columns include "To Do," "In Progress," and "Completed."

### 4. **Real-Time Updates**
   - The board updates in real-time when tasks are added or moved, allowing multiple users to collaborate effectively.

### 5. **CORS Support**
   - The API is configured to handle cross-origin requests, allowing access from different domains.

### 6. **Responsive Design**
   - The application is fully responsive, ensuring it works well on both desktop and mobile devices.

## Setup and Installation

### Prerequisites

- Node.js (version 14.x or higher)
- npm or yarn
- MongoDB (or any other database if you have a different configuration)

### Steps to Set Up Locally

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/kanban-board.git
   cd kanban-board
