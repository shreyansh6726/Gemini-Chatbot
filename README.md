# Gemini Chatbot

A frontend-only Gemini chatbot built with React and the `@google/genai` JavaScript SDK.

## What changed

- The Python backend is no longer used by the app runtime.
- Chat requests now run directly from the React frontend.
- Image attachment and image generation both work from the browser UI.
- No Dockerfile is required for the active app flow.

## Setup

1. Install frontend dependencies:

```bash
cd frontend
npm install
```

2. Create `frontend/.env`:

```env
REACT_APP_GEMINI_API_KEY=your_google_gemini_api_key_here
```

3. Start the app:

```bash
npm start
```

## Notes

- This is a client-side implementation, so the API key is exposed in the browser build.
- If you want a production-safe architecture later, we should move the API key back behind a serverless function.

## License

[MIT License](LICENSE)
