# ScholarGuard Node.js Analysis Engine (v2.5)

Express.js rewrite of the Python FastAPI analysis engine (`backend/main.py`).

## 🚀 Overview

This backend provides the exact same endpoints, scoring algorithms, and forensic checks as the Python engine:
- **`GET /health`** — Service status check
- **`POST /analyze/url`** — Live web crawling, WHOIS resolution, TLD risk scoring, homoglyph attack detection
- **`POST /analyze/text`** — Fee keyword extraction, coercion pattern detection, identity solicitation markers
- **`POST /analyze/entity`** — IRS 990 nonprofit database lookup, EIN format validation, entity type risk scoring

## 📦 Installation

```bash
cd backend/node_backend
npm install
```

## 🏃 Running the Node Engine

### Default (Port 8000)
> Note: If Python backend is currently running on port 8000, stop it first or run on another port.
```bash
npm start
```

### Run on a Custom Port (e.g., 8001)
```bash
PORT=8001 npm start
```

### Dev mode with live reload
```bash
npm run dev
```

## 🧪 Testing Endpoints

### 1. Health Check
```bash
curl http://localhost:8000/health
```

### 2. Analyze Text
```bash
curl -X POST http://localhost:8000/analyze/text \
  -H "Content-Type: application/json" \
  -d '{"text": "Guaranteed award! Pay $50 registration fee now. Only 2 slots left."}'
```

### 3. Analyze Entity
```bash
curl -X POST http://localhost:8000/analyze/entity \
  -H "Content-Type: application/json" \
  -d '{"organization_name": "Gates Foundation"}'
```

### 4. Analyze URL
```bash
curl -X POST http://localhost:8000/analyze/url \
  -H "Content-Type: application/json" \
  -d '{"url": "https://studentaid.gov"}'
```
