from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
from services import ollama_service, azura_service
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# 允许跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageItem(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    apiType: str
    context: List[MessageItem] = []
    characterSetting: Optional[str] = None

@app.post("/chat")
async def chat_endpoint(payload: ChatRequest):
    """
    """
    try:
        if payload.apiType == "ollama":
            response_text = ollama_service.get_completion(
                message=payload.message,
                context=payload.context,
                character_setting=payload.characterSetting
            )
        else:
            response_text = azura_service.get_completion(
                message=payload.message,
                context=payload.context,
                character_setting=payload.characterSetting
            )

        return {"success": True, "data": response_text}
    except Exception as e:
        return {"success": False, "error": str(e)}
