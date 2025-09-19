# app/api/test.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional
import os, re, sqlite3

from app.core.db import get_conn  # 你已有的连接函数（写/读都可）。我们会在代码层限制只读查询。

router = APIRouter(prefix="/api/test", tags=["test"])

# 仅在开发开启： export ALLOW_SQL_API=1
def ensure_enabled():
    if os.getenv("ALLOW_SQL_API") != "1":
        # 不暴露细节：当未启用时直接 404 或 403 都可
        raise HTTPException(status_code=404, detail="Not Found")
    return True

class SQLReq(BaseModel):
    sql: str = Field(..., description="仅支持单条 SELECT 语句")
    params: Optional[Dict[str, Any]] = Field(default=None, description="命名参数，如 {\"id\": 1}")
    limit: int = Field(default=100, ge=1, le=1000, description="最大返回行数")

def _validate_sql(sql: str) -> str:
    """极简白名单校验：仅允许单条 SELECT；拒绝常见危险关键字/多语句。"""
    s = sql.strip().strip(";")
    # 只允许以 SELECT 开头（可选 with CTE）
    if not re.match(r"^(with\s+.+\s+)?select\s", s, flags=re.IGNORECASE | re.DOTALL):
        raise HTTPException(400, "只允许 SELECT 查询")

    # 拒绝多语句 & 注释 & DDL/DML/PRAGMA 等
    forbidden = [
        r";", r"--", r"/\*", r"\*/",
        r"\b(insert|update|delete|create|alter|drop|replace|truncate|attach|detach|vacuum|pragma|begin|commit|rollback)\b",
    ]
    for pat in forbidden:
        if re.search(pat, s, flags=re.IGNORECASE):
            raise HTTPException(400, f"包含不允许的关键字/语法：{pat}")

    return s

def _maybe_append_limit(sql: str, limit: int) -> str:
    # 如果没有明显 LIMIT，则附加；简单判断，避免重复
    if re.search(r"\blimit\b", sql, flags=re.IGNORECASE):
        return sql
    return f"{sql} LIMIT {int(limit)}"

@router.post("/sql", dependencies=[Depends(ensure_enabled)])
def run_sql(body: SQLReq):
    # 1) 校验 SQL
    safe_sql = _validate_sql(body.sql)
    safe_sql = _maybe_append_limit(safe_sql, body.limit)

    # 2) 执行（只读意图：我们只放行 SELECT，且上面做了拦截）
    conn = get_conn()
    conn.row_factory = sqlite3.Row
    try:
        cur = conn.cursor()
        cur.execute(safe_sql, body.params or {})
        rows = cur.fetchall()
    finally:
        conn.close()

    # 3) 结果格式化
    items: List[Dict[str, Any]] = [dict(r) for r in rows]
    return {
        "ok": True,
        "count": len(items),
        "rows": items,
    }
