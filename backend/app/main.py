from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.db import init_db, ensure_owner_admin
from app.core.security import hash_password
from app.api import auth, users
from app.api import test as test_api  # 新增

app = FastAPI(title="xcontract backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(test_api.router)   # 新增


