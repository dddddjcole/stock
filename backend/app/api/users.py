from fastapi import APIRouter, Depends, HTTPException, Request
from ..core.db import get_conn
from ..core.security import decode_token

router = APIRouter(prefix="/api/users", tags=["users"])

def require_admin(request: Request):
    token = request.cookies.get("session")
    data = decode_token(token) if token else None
    if not data or data.get("role") not in ("owner","admin"):
        raise HTTPException(403, "Forbidden")
    return data

@router.get("")
def list_users(_: dict = Depends(require_admin)):
    conn = get_conn(); c = conn.cursor()
    c.execute("SELECT id,username,role,display_name,is_active,created_at FROM users ORDER BY id")
    rows = [dict(r) for r in c.fetchall()]
    conn.close()
    return rows

