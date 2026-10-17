from fastapi import APIRouter
from app.schemas.agent import AgentChatRequest, AgentChatResponse
from app.agent.assistant import process_agent_chat

router = APIRouter(prefix="/api/agent", tags=["AI Assistant"])

@router.post("/chat", response_model=AgentChatResponse)
def chat_with_agent(request: AgentChatRequest) -> AgentChatResponse:
    """
    AI Financial Assistant endpoint.
    Orchestrates allowlisted financial tools and explains results transparently.
    """
    return process_agent_chat(request)
