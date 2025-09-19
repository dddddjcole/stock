from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "change-me"          # 用环境变量覆盖
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 24*60
    DB_PATH: str = "/root/stock/data/xcontract_core.db"
    CORS_ORIGINS: list[str] = [
        "http://8.136.0.86:3000",   # ← 把你的前端 Origin 精确写上
        "http://localhost:3000",        # 本地开发可保留
        "http://127.0.0.1:3000",
    ]

settings = Settings()

