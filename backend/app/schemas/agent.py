from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Literal

class AgentToolResult(BaseModel):
    tool: str
    inputs: Dict[str, Any]
    outputs: Dict[str, Any]

class AgentChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000, description="User query or financial question")
    scenario_context: Optional[Dict[str, Any]] = Field(default=None, description="Current budget context from frontend form")

class AgentChatResponse(BaseModel):
    answer: str
    tool_results: List[AgentToolResult] = Field(default_factory=list)
    assumptions: List[str] = Field(default_factory=list)
    mode: Literal["llm", "demo"]
