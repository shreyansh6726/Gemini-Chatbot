# Gemini Chatbot

A frontend-first Gemini chatbot built with React and a small serverless API route in `frontend/api/`.

## What changed

- The Python backend is no longer used by the app runtime.
- Chat requests now go through a same-origin serverless function, which avoids browser CORS issues.
- Image attachment and image generation both work from the browser UI.
- No Dockerfile is required for the active app flow.

## Setup

1. Install frontend dependencies:

```bash
cd frontend
npm install
```

2. Create `frontend/.env` for local frontend development:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

3. Start the app:

```bash
npm start
```

## Notes

- The browser calls `frontend/api/chat.js`, so the Gemini key stays server-side.
- On Vercel, set `GEMINI_API_KEY` as an environment variable for the deployment.
- If you deploy the app somewhere else, you’ll need an equivalent serverless function path.

## License

[MIT License](LICENSE)
