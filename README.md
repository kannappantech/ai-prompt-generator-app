# AI Prompt Generator App

A full-stack web application that helps users generate effective AI prompts for various AI tools like ChatGPT, DALL-E, and Midjourney.

## Project Structure

```
ai-prompt-generator/
├── frontend/          # React frontend application
├── backend/           # Flask backend API
├── docs/              # Documentation files
└── README.md          # This file
```

## Technology Stack

### Frontend
- **React** - JavaScript library for building user interfaces
- **Material-UI (MUI)** - React component library for modern UI design
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and development server

### Backend
- **Flask** - Lightweight Python web framework
- **SQLite** - Database for development (will migrate to PostgreSQL for production)
- **Flask-CORS** - Cross-Origin Resource Sharing support

### Authentication
- **Keycloak** - Open-source identity and access management (to be integrated)

### AI Integration
- **OpenAI API** - For AI prompt generation capabilities

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- Python 3.11
- Git

### Frontend Setup
```bash
cd frontend
pnpm install
pnpm run dev
```

### Backend Setup
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
python src/main.py
```

## Features

- **Intuitive Interface**: Clean, user-friendly design for easy prompt generation
- **Multiple AI Tools Support**: Generate prompts optimized for different AI platforms
- **Customization Options**: Adjust prompt style, creativity level, and target audience
- **User Authentication**: Save and manage your generated prompts
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Copy & Share**: Easy copying and sharing of generated prompts

## API Endpoints

- `POST /api/generate-prompt` - Generate AI prompt from user input
- `GET /api/prompts` - Retrieve user's saved prompts
- `POST /api/prompts` - Save a generated prompt
- `DELETE /api/prompts/:id` - Delete a saved prompt

## Deployment

The application will be deployed using:
- **Frontend**: Netlify (free tier)
- **Backend**: Render (free tier)
- **Database**: PostgreSQL on Render (free tier)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.
