from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "change-me"          # 用环境变量覆盖
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 24*60
    DB_PATH: str = "/tmp/xcontract.db"
    CORS_ORIGINS: list[str] = ["http://localhost:5173"]

settings = Settings()

