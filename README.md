# Gemini Chatbot

A full-stack, AI-powered chatbot application utilizing Google's **Gemini 2.5 Flash** model with live web search capabilities. The project features a beautifully designed React frontend and a robust FastAPI Python backend, fully configured for deployment on platforms like Hugging Face Spaces.

## 🌟 Features

- **Blazing Fast Responses:** Powered by Google's highly optimized Gemini 2.5 Flash model.
- **Live Search Capabilities:** Integrates the Google Search tool for retrieving real-time data.
- **Beautiful UI/UX:** A modern, glassmorphism-inspired chat interface with smooth animations and responsive design.
- **Full-Stack Architecture:** 
  - **Frontend:** React, React Router, Axios, Lucide Icons.
  - **Backend:** FastAPI, Python, Google GenAI SDK.
- **Dockerized Backend:** Ready-to-deploy `Dockerfile` configured specifically for Hugging Face Spaces (non-root user, port 7860).

## 🚀 Tech Stack

- **Frontend:** React, standard CSS (custom design system)
- **Backend:** FastAPI, Uvicorn
- **AI/LLM:** `google-genai` (Gemini 2.5 Flash)
- **Deployment:** Docker

## 📁 Project Structure

```
Gemini-Chatbot/
├── backend/
│   ├── app.py             # FastAPI application and Gemini logic
│   ├── Dockerfile         # Hugging Face Spaces compatible Dockerfile
│   ├── requirements.txt   # Python dependencies
│   └── .env               # Backend environment variables
└── frontend/
    ├── public/            # Static assets and manifest.json
    ├── src/
    │   ├── pages/         # React components (Home.jsx, Chat.jsx)
    │   ├── App.jsx        # Main router and container
    │   └── index.css      # Custom styling and animations
    ├── package.json       # React dependencies
    └── .env               # Frontend environment variables
```

## 🛠️ Setup & Installation

### 1. Backend Setup

Navigate to the `backend` directory and set up the Python environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

**Environment Variables:**
Create a `.env` file in the `backend` folder and add your Gemini API Key:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

**Run the Backend Server:**
```bash
uvicorn app:app --reload
```
The server will start on `http://localhost:8000`.

### 2. Frontend Setup

Navigate to the `frontend` directory and install the Node modules:

```bash
cd frontend
npm install
```

**Environment Variables:**
Create a `.env` file in the `frontend` folder to point to your backend:
```env
REACT_APP_BACKEND=http://localhost:8000
```

**Run the Frontend Server:**
```bash
npm start
```
The React application will open in your browser at `http://localhost:3000`.

## 🐳 Docker Deployment (Hugging Face Spaces)

The backend includes a `Dockerfile` specifically tailored for Hugging Face Spaces. It runs as a non-root user and exposes port `7860`.

To build and test the Docker container locally:

```bash
cd backend
docker build -t gemini-backend .
docker run -p 7860:7860 --env-file .env gemini-backend
```

To deploy, simply push the `backend` folder contents to your Hugging Face Space repository!

## 📝 License

[MIT License](LICENSE)
