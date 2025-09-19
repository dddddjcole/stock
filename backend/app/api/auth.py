from fastapi import APIRouter, HTTPException, Response, Depends
from ..models.user import UserCreate, LoginIn
from ..core.db import get_conn
from ..core.security import hash_password, verify_password, create_token, decode_token

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register")
def register(body: UserCreate):
    email = body.email.strip().lower()
    display_name = (body.display_name or email).strip()
    if not body.password or len(body.password) < 6:
        raise HTTPException(422, "密码至少 6 位")

    conn = get_conn(); c = conn.cursor()
    try:
        # 1) 先查是否已存在
        c.execute("SELECT 1 FROM users WHERE email = ?", (email,))
        if c.fetchone():
            raise HTTPException(409, "该邮箱已注册")

        # 2) 再插入
        c.execute(
            "INSERT INTO users(email,password_hash,role,display_name,is_active) VALUES (?,?,?,?,1)",
            (email, hash_password(body.password), "user", display_name),
        )
        conn.commit()
    finally:
        conn.close()

    return {"ok": True}

@router.post("/login")
def login(body: LoginIn, response: Response):
    email = body.email.lower().strip()

    conn = get_conn(); c = conn.cursor()
    try:
        c.execute("SELECT * FROM users WHERE email=?", (email,))
        row = c.fetchone()
    finally:
        conn.close()

    # 统一错误信息，避免用户名枚举
    invalid_msg = HTTPException(401, "账号不存在")
    if not row or row["is_active"] != 1:
        raise invalid_msg
    invalid_msg = HTTPException(401, "密码错误")
    if not verify_password(body.password, row["password_hash"]):
        raise invalid_msg

    sub = {
        "id": row["id"],
        "email": row["email"],
        "role": row["role"],
        "display_name": row["display_name"] or row["email"],
    }
    token = create_token(sub)

    # 写 HttpOnly Cookie
    # - 同域：Lax 即可
    # - 跨域（前后端不同站点）：需要 samesite="None", secure=True（HTTPS）
    response.set_cookie(
        key="session",
        value=token,
        httponly=True,
        samesite="Lax",     # 如跨站请求，请改为 "None" 并确保 HTTPS + secure=True
        secure=False,       # 生产务必 True（HTTPS）
        path="/",
        # max_age=30*24*3600,  # 可选：持久化
    )

    return {"ok": True, "user": sub}

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

