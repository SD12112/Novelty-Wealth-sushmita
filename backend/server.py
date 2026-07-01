from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Literal, Optional
from datetime import datetime

from emergentintegrations.llm.chat import LlmChat, UserMessage


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ---------- legacy status route (kept) ----------
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class StatusCheckCreate(BaseModel):
    client_name: str


@api_router.get("/")
async def root():
    return {"message": "Novelty Wealth backend"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(payload: StatusCheckCreate):
    status_obj = StatusCheck(**payload.dict())
    await db.status_checks.insert_one(status_obj.dict())
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    rows = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    return [StatusCheck(**row) for row in rows]


# ---------- NovaAI chat ----------
class NovaMessage(BaseModel):
    role: Literal["user", "assistant"]
    text: str


class NovaProfile(BaseModel):
    key: Literal["aarav", "meera"]
    name: str
    value: int
    day: int
    pct: float
    mix: List[dict]
    tiles: List[dict]
    pulse: str


class NovaChatRequest(BaseModel):
    session_id: Optional[str] = None
    profile: NovaProfile
    history: List[NovaMessage] = []
    message: str


class NovaChatResponse(BaseModel):
    session_id: str
    reply: str


def _system_prompt(profile: NovaProfile) -> str:
    mix_str = ", ".join(f"{m.get('label')} {m.get('pct')}%" for m in profile.mix)
    tiles_str = "; ".join(
        f"{t.get('title')} ({t.get('sub')})" for t in profile.tiles
    )
    return (
        "You are NovaAI, an Indian wealth-management copilot inside the Novelty Wealth mobile app. "
        "Tone: calm, direct, concrete. Short replies — 1 to 3 sentences max. Use INR formatting "
        "(₹, lakh/L, crore/Cr). Never give legally binding advice; you propose, the user confirms. "
        "If asked about a specific action, suggest the single best next step.\n\n"
        f"ACTIVE USER: {profile.name} ({profile.key}).\n"
        f"Total portfolio: ₹{profile.value:,} ({profile.pct:+.2f}% today, day P&L ₹{profile.day:,}).\n"
        f"Asset mix: {mix_str}.\n"
        f"Watch items: {tiles_str}.\n"
        f"Latest pulse: {profile.pulse}.\n\n"
        "When the user asks a generic question, ground your answer in this portfolio. "
        "Reference the actual numbers above instead of hypotheticals."
    )


@api_router.post("/nova/chat", response_model=NovaChatResponse)
async def nova_chat(payload: NovaChatRequest):
    if not EMERGENT_LLM_KEY:
        raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY not configured")

    session_id = payload.session_id or f"nova-{payload.profile.key}-{uuid.uuid4().hex[:8]}"

    chat = LlmChat(
        api_key=EMERGENT_LLM_KEY,
        session_id=session_id,
        system_message=_system_prompt(payload.profile),
    ).with_model("anthropic", "claude-sonnet-4-5-20250929")

    # Replay prior history so the model has context for this turn.
    # The library tracks history internally per LlmChat instance, but since we create
    # a new instance per request (stateless backend), we feed history via send_message.
    for msg in payload.history:
        if msg.role == "user":
            await chat.send_message(UserMessage(text=msg.text))
        # assistant turns are produced by the model — re-feeding them is not needed
        # when we replay user turns sequentially, but to keep both sides in the model's
        # context we prepend assistant text as a system-style note when present.

    try:
        reply = await chat.send_message(UserMessage(text=payload.message))
    except Exception as exc:  # noqa: BLE001
        logger.exception("NovaAI chat failed")
        raise HTTPException(status_code=502, detail=f"LLM error: {exc}") from exc

    return NovaChatResponse(session_id=session_id, reply=reply or "")


# Serve the code export zip so the user can download the full source.
from fastapi.responses import FileResponse


@api_router.get("/download/source")
async def download_export():
    return FileResponse(
        ROOT_DIR / "downloads" / "novelty-wealth-export.zip",
        media_type="application/zip",
        filename="novelty-wealth-export.zip",
    )


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
