# TaskFlow

**A modern task management application built with React, FastAPI, and SQLite.**

TaskFlow is a full-stack task management application designed to help users organize their work, manage priorities, and keep track of deadlines through a clean and intuitive interface.

The project was built to develop and demonstrate practical full-stack development skills, including frontend development, REST API design, database integration, and application architecture.

## Features

- **Task Management:** Create, view, edit, and delete tasks.
- **Task Priorities:** Organize tasks by low, medium, and high priority.
- **Deadline Management:** Set due dates and identify overdue tasks.
- **Search:** Find tasks by title or description.
- **Filtering:** Browse tasks by completion status and priority.
- **Task Details:** View and manage individual task information.
- **Responsive Interface:** Clean user interface designed for different screen sizes.

## Tech Stack

### Frontend
- React
- JavaScript
- Vite
- CSS
- Lucide React

### Backend
- Python
- FastAPI
- SQLite
- REST API

### Development Tools
- Git
- GitHub
- npm
- Python Virtual Environment

## Project Structure

```text
TaskManager/
├── backend/
│   ├── main.py
│   ├── database.py
│   └── tasks.db
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── index.html
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Python 3.10+
- Node.js and npm

### 1. Clone the repository

```bash
git clone https://github.com/LeventeForro/TaskFlow.git
cd taskflow
```

### 2. Set up the backend

Create and activate a virtual environment:

```bash
python -m venv backend/.venv
source backend/.venv/bin/activate
```

Install the dependencies:

```bash
pip install fastapi uvicorn
```

Start the backend server from the project root:

```bash
python -m uvicorn backend.main:app --reload
```

The API will be available at:

`http://127.0.0.1:8000`

Interactive API documentation:

`http://127.0.0.1:8000/docs`

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

`http://localhost:5173`

## What I Learned

This project has helped me gain hands-on experience with:

- Building interactive user interfaces with React.
- Developing RESTful APIs using FastAPI.
- Connecting a frontend application to a backend API.
- Designing and working with relational databases using SQLite.
- Implementing CRUD operations.
- Managing application state and user interactions.
- Structuring a full-stack application.
- Using Git and GitHub for version control.

## Future Improvements

Planned features and improvements include:

- Project and category management.
- Custom task labels and tags.
- Kanban board with task status management.
- Calendar view.
- Drag-and-drop task organization.
- Improved testing and deployment.

## Project Status

TaskFlow is an ongoing personal development project. New features and improvements are being added as development progresses.

## Author

**Levente Forró**

Aspiring Full-Stack Developer

[GitHub](https://github.com/LeventeForro)

---

*Built as a personal portfolio project to demonstrate full-stack development skills.*