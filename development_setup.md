# Development Setup Guide

This guide provides step-by-step instructions for setting up the AI Prompt Generator App development environment.

## Project Structure Overview

The project is organized as a monorepo with separate frontend and backend applications:

```
ai-prompt-generator/
├── frontend/          # React application with Vite
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility functions
│   │   └── assets/        # Static assets
│   ├── public/            # Public assets
│   └── package.json       # Frontend dependencies
├── backend/           # Flask API server
│   ├── src/
│   │   ├── models/        # Database models
│   │   ├── routes/        # API route handlers
│   │   └── main.py        # Application entry point
│   ├── venv/              # Python virtual environment
│   └── requirements.txt   # Python dependencies
├── docs/              # Project documentation
└── README.md          # Main project documentation
```

## Prerequisites

Before starting development, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **Python** (version 3.11)
- **Git** for version control
- **pnpm** (comes with the React template)

## Frontend Development Setup

The frontend is built with React, Vite, Tailwind CSS, and shadcn/ui components.

### Starting the Frontend Development Server

```bash
cd frontend
pnpm run dev --host
```

The development server will start on `http://localhost:5173` and automatically reload when you make changes to the code.

### Available Frontend Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint

## Backend Development Setup

The backend is built with Flask and uses SQLite for development.

### Activating the Python Virtual Environment

```bash
cd backend
source venv/bin/activate
```

### Installing Backend Dependencies

```bash
pip install -r requirements.txt
```

### Starting the Backend Development Server

```bash
python src/main.py
```

The Flask server will start on `http://localhost:5000` by default.

## Development Workflow

### Making Changes

1. **Frontend Changes**: Edit files in `frontend/src/` and the development server will automatically reload
2. **Backend Changes**: Edit files in `backend/src/` and restart the Flask server to see changes
3. **Database Changes**: Modify models in `backend/src/models/` and update the database schema

### Testing the Full Stack

1. Start both the frontend and backend servers
2. The frontend will proxy API requests to the backend during development
3. Test the complete user flow from the React interface

## Environment Variables

Create environment variable files for different configurations:

### Frontend Environment Variables

Create `frontend/.env.local`:
```
VITE_API_BASE_URL=http://localhost:5000
```

### Backend Environment Variables

Create `backend/.env`:
```
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here
OPENAI_API_KEY=your-openai-api-key
```

## Database Setup

The development environment uses SQLite, which is automatically created when you first run the Flask application. The database file is located at `backend/src/database/app.db`.

## Common Development Tasks

### Adding New Frontend Components

1. Create component files in `frontend/src/components/`
2. Use shadcn/ui components and Tailwind CSS for styling
3. Import and use in your main application

### Adding New API Endpoints

1. Create route handlers in `backend/src/routes/`
2. Register blueprints in `backend/src/main.py`
3. Test endpoints using tools like Postman or curl

### Installing New Dependencies

**Frontend:**
```bash
cd frontend
pnpm add package-name
```

**Backend:**
```bash
cd backend
source venv/bin/activate
pip install package-name
pip freeze > requirements.txt
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Change ports in configuration if 5173 or 5000 are in use
2. **CORS errors**: Ensure Flask-CORS is properly configured
3. **Module import errors**: Check that you're in the correct virtual environment
4. **Build failures**: Clear node_modules and reinstall dependencies

### Getting Help

- Check the project documentation in the `docs/` folder
- Review error messages in the browser console and terminal
- Ensure all prerequisites are properly installed
