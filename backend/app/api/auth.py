from fastapi import APIRouter, HTTPException, Response, Depends
from ..models.user import UserCreate, LoginIn
from ..core.db import get_conn
from ..core.security import hash_password, verify_password, create_token, decode_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register")
def register(body: UserCreate):
    conn = get_conn(); c = conn.cursor()
    try:
        c.execute("INSERT INTO users(username,password_hash,role,display_name,is_active) VALUES (?,?,?,?,1)",
                  (body.username, hash_password(body.password), "user", body.display_name or body.username))
        conn.commit()
    except Exception:
        raise HTTPException(400, "用户名已存在")
    finally:
        conn.close()
    return {"ok": True}

@router.post("/login")
def login(body: LoginIn, response: Response):
    conn = get_conn(); c = conn.cursor()
    c.execute("SELECT * FROM users WHERE username=?", (body.username,))
    row = c.fetchone(); conn.close()
    if not row or row["is_active"] != 1:
        raise HTTPException(401, "用户不存在或停用")
    if not verify_password(body.password, row["password_hash"]):
        raise HTTPException(401, "密码错误")
    sub = {"id": row["id"], "username": row["username"], "role": row["role"], "display_name": row["display_name"] or row["username"]}
    token = create_token(sub)
    # 写 HttpOnly Cookie（也可以前端存 localStorage，这里选更安全的 Cookie）
    response.set_cookie("session", token, httponly=True, samesite="Lax")
    return {"ok": True}

@router.post("/logout")
def logout(response: Response):
    response.delete_cookie("session")
    return {"ok": True}

def get_current_user(token: str | None = None, cookie: str | None = None):
    # 供其他模块复用的小工具
    return decode_token(token or cookie)

@router.get("/me")
def me(session: str | None = None):
    data = decode_token(session) if session else None
    if not data: raise HTTPException(401, "未登录")
    return data

