import os
import sys
import base64
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

app = FastAPI(title="Gemini Chatbot API")

# Enable CORS for the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global chat session and client to persist history and connection in memory
client = None
chat_session = None

def init_chat_session():
    global chat_session, client
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("Warning: GEMINI_API_KEY not found in .env")
        return

    try:
        client = genai.Client(api_key=api_key)
        model = "gemini-2.5-flash"
        generate_content_config = types.GenerateContentConfig(
            response_modalities=["TEXT"],
            tools=[types.Tool(google_search=types.GoogleSearch())],
        )
        chat_session = client.chats.create(
            model=model,
            config=generate_content_config
        )
        print("Gemini Chatbot Session Initialized!")
    except Exception as e:
        print(f"Failed to initialize Gemini session: {e}")

@app.on_event("startup")
def startup_event():
    init_chat_session()

class MessageRequest(BaseModel):
    message: str
    image: str | None = None  # Base64 encoded image
    image_type: str | None = None  # MIME type (e.g., "image/jpeg", "image/png")

@app.post("/api/chat")
def chat_endpoint(req: MessageRequest):
    global chat_session
    if not req.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    if chat_session is None:
        init_chat_session()
        if chat_session is None:
            raise HTTPException(status_code=500, detail="Failed to initialize chat session. Check API key.")

    try:
        # Build content with text and optional image
        if req.image and req.image_type:
            # Decode base64 image and create multimodal content
            image_bytes = base64.b64decode(req.image)
            image_part = types.Part(
                inline_data=types.Blob(
                    mime_type=req.image_type,
                    data=image_bytes
                )
            )
            text_part = types.Part(text=req.message)
            response = chat_session.send_message([text_part, image_part])
        else:
            # Text only message
            response = chat_session.send_message(req.message)
        
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini API Error: {str(e)}")

@app.get("/api/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
