import sqlite3, os
from .config import settings

os.makedirs(os.path.dirname(settings.DB_PATH), exist_ok=True)

def get_conn():
    conn = sqlite3.connect(settings.DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn

def init_db():
    conn = get_conn(); c = conn.cursor()
    c.execute("""
    CREATE TABLE IF NOT EXISTS users(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('owner','admin','manager','user')),
      display_name TEXT DEFAULT '',
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )""")
    conn.commit(); conn.close()

def ensure_owner_admin(hash_password):
    conn = get_conn(); c = conn.cursor()
    c.execute("SELECT COUNT(1) FROM users"); n = c.fetchone()[0]
    if n == 0:
        c.execute("INSERT INTO users(username,password_hash,role,display_name,is_active) VALUES (?,?,?,?,1)",
                  ("admin", hash_password("Dong5032"), "owner", "Owner Admin"))
        conn.commit()
    conn.close()

