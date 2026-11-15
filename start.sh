#!/usr/bin/env bash
# ScholarGuard — Start all services

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  🛡️  ScholarGuard Verification Platform"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Start Python analysis engine in background
echo "▶ Starting Python Analysis Engine on :8000..."
cd "$PROJECT_DIR/backend"
venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "  PID: $BACKEND_PID"
echo ""

# Wait for backend to start
sleep 2

# Verify backend
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
  echo "  ✅ Analysis Engine: ONLINE"
else
  echo "  ⚠️  Analysis Engine: starting up..."
fi

echo ""

# Start Next.js frontend
echo "▶ Starting Next.js Frontend on :3000..."
cd "$PROJECT_DIR"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Frontend:  http://localhost:3000"
echo "  API Docs:  http://localhost:8000/docs"
echo "  Admin:     http://localhost:3000/admin"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Press Ctrl+C to stop all services."
echo ""

# Wait and cleanup on exit
trap "echo ''; echo 'Stopping services...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0" INT TERM
wait

