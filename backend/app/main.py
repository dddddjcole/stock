from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .core.db import init_db, ensure_owner_admin
from .core.security import hash_password
from .api import auth, users

app = FastAPI(title="xcontract backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

init_db(); ensure_owner_admin(hash_password)
app.include_router(auth.router)
app.include_router(users.router)

