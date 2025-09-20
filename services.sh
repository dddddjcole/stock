#!/usr/bin/env bash
# services.sh — minimal start/stop/status/logs for backend (uvicorn) + frontend (Next.js)
set -euo pipefail

# ==== 配置（按需改） ====
BACKEND_DIR="/root/xcontract/stock/backend"
BACKEND_CMD='uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload'

WEB_DIR="/root/xcontract/stock/web"
WEB_BUILD_CMD='npm ci && npm run build'
WEB_START_CMD='npm run start'     # 生产启动；若要开发可改为 npm run dev

BASE_DIR="$(pwd)"
RUN_DIR="$BASE_DIR/run"
LOG_DIR="$BASE_DIR/logs"
mkdir -p "$RUN_DIR" "$LOG_DIR"

BACKEND_OUT="$LOG_DIR/backend.out"
BACKEND_ERR="$LOG_DIR/backend.err"
WEB_OUT="$LOG_DIR/web.out"
WEB_ERR="$LOG_DIR/web.err"

BACKEND_PID="$RUN_DIR/backend.pid"
WEB_PID="$RUN_DIR/web.pid"

# ==== 工具函数 ====
is_running() {
  local pidfile="$1"
  [[ -f "$pidfile" ]] || return 1
  local pid
  pid="$(cat "$pidfile" 2>/dev/null || true)"
  [[ -n "${pid:-}" ]] || { rm -f "$pidfile"; return 1; }
  ps -p "$pid" >/dev/null 2>&1
}

start_backend() {
  if is_running "$BACKEND_PID"; then
    echo "[backend] already running: $(cat "$BACKEND_PID")"
    return 0
  fi
  echo "[backend] starting: $BACKEND_CMD"
  ( cd "$BACKEND_DIR"
    nohup bash -lc "$BACKEND_CMD" >>"$BACKEND_OUT" 2>>"$BACKEND_ERR" &
    echo $! >"$BACKEND_PID"
  )
  echo "[backend] started pid $(cat "$BACKEND_PID")"
  echo "  logs: $BACKEND_OUT | $BACKEND_ERR"
}

start_web() {
  if is_running "$WEB_PID"; then
    echo "[web] already running: $(cat "$WEB_PID")"
    return 0
  fi
  echo "[web] building: $WEB_BUILD_CMD"
  ( cd "$WEB_DIR"
    bash -lc "$WEB_BUILD_CMD" >>"$WEB_OUT" 2>>"$WEB_ERR"
    echo "[web] starting: $WEB_START_CMD" >>"$WEB_OUT"
    nohup bash -lc "$WEB_START_CMD" >>"$WEB_OUT" 2>>"$WEB_ERR" &
    echo $! >"$WEB_PID"
  )
  echo "[web] started pid $(cat "$WEB_PID")"
  echo "  logs: $WEB_OUT | $WEB_ERR"
}

stop_one() {
  local name="$1" pidfile="$2"
  if is_running "$pidfile"; then
    local pid
    pid="$(cat "$pidfile")"
    echo "[$name] stopping $pid ..."
    kill "$pid" 2>/dev/null || true
    for _ in {1..10}; do
      ps -p "$pid" >/dev/null 2>&1 || break
      sleep 0.3
    done
    if ps -p "$pid" >/dev/null 2>&1; then
      echo "[$name] still running, kill -9"
      kill -9 "$pid" 2>/dev/null || true
    fi
    rm -f "$pidfile"
    echo "[$name] stopped"
  else
    echo "[$name] not running"
  fi
}

status_one() {
  local name="$1" pidfile="$2"
  if is_running "$pidfile"; then
    echo "[$name] RUNNING (pid $(cat "$pidfile"))"
  else
    echo "[$name] STOPPED"
  fi
}

logs_tail() {
  echo "== backend (tail -n 100) =="
  tail -n 100 "$BACKEND_OUT" 2>/dev/null || true
  echo
  echo "== web (tail -n 100) =="
  tail -n 100 "$WEB_OUT" 2>/dev/null || true
  echo
  echo "(follow with: tail -f $BACKEND_OUT $WEB_OUT)"
}

case "${1:-}" in
  start)
    start_backend
    start_web
    ;;
  stop)
    stop_one "web" "$WEB_PID"
    stop_one "backend" "$BACKEND_PID"
    ;;
  restart)
    "$0" stop
    "$0" start
    ;;
  status)
    status_one "backend" "$BACKEND_PID"
    status_one "web" "$WEB_PID"
    ;;
  logs)
    logs_tail
    ;;
  *)
    cat <<EOF
Usage: $0 {start|stop|restart|status|logs}

Paths:
  backend: $BACKEND_DIR
  web:     $WEB_DIR

Outputs:
  logs: $LOG_DIR
  pids: $RUN_DIR
EOF
    exit 1
    ;;
esac

