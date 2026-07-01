"""Backend tests for Novelty Wealth API (root + Nova chat)."""
import os
import pytest
import requests

BASE_URL = os.environ.get("EXPO_BACKEND_URL", "https://79b87750-db5c-404f-92b3-f0bcc68cab14.preview.emergentagent.com").rstrip("/")


@pytest.fixture
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# --- root ---
def test_root_api(api):
    r = api.get(f"{BASE_URL}/api/", timeout=30)
    assert r.status_code == 200
    body = r.json()
    assert "Novelty Wealth" in body.get("message", "")


# --- nova chat happy path ---
SAMPLE_PROFILE = {
    "key": "aarav",
    "name": "Aarav",
    "value": 4200000,
    "day": 3200,
    "pct": 0.08,
    "mix": [
        {"label": "Equity MF", "pct": 62},
        {"label": "Debt MF", "pct": 28},
        {"label": "Cash", "pct": 10},
    ],
    "tiles": [
        {"title": "SIP due", "sub": "3 SIPs"},
        {"title": "Rebalance", "sub": "5% drift"},
    ],
    "pulse": "Nifty flat, small-caps -0.9%",
}


def test_nova_chat_missing_message(api):
    """message is required -> 422 from FastAPI."""
    r = api.post(f"{BASE_URL}/api/nova/chat", json={"profile": SAMPLE_PROFILE, "history": []}, timeout=30)
    assert r.status_code == 422


def test_nova_chat_returns_200_or_502(api):
    payload = {"profile": SAMPLE_PROFILE, "history": [], "message": "Give me one action today."}
    r = api.post(f"{BASE_URL}/api/nova/chat", json=payload, timeout=90)
    # If EMERGENT_LLM_KEY has budget, 200. If budget exceeded, backend surfaces 502 (per code).
    assert r.status_code in (200, 502), f"unexpected {r.status_code}: {r.text[:300]}"
    if r.status_code == 200:
        data = r.json()
        assert "session_id" in data and data["session_id"]
        assert "reply" in data and isinstance(data["reply"], str)
