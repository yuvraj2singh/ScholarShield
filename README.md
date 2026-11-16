# ScholarShield — Scholarship Verification Portal

[![Live Production](https://img.shields.io/badge/Live%20Web%20App-Vercel-black?style=for-the-badge&logo=vercel)](https://scholar-shield-yuvadsin.vercel.app/)
[![Backend Engine](https://img.shields.io/badge/FastAPI%20Sidecar-Render-46E3B7?style=for-the-badge&logo=render)](https://scholarshield-e6ob.onrender.com/health)

- **Production Portal**: [https://scholar-shield-yuvadsin.vercel.app](https://scholar-shield-yuvadsin.vercel.app/)
- **Live Forensic Engine**: [https://scholarshield-e6ob.onrender.com](https://scholarshield-e6ob.onrender.com/health)

## 🛡️ Project Overview

A full-stack scholarship fraud detection and verification portal built with **Next.js 14 (App Router)** in plain JavaScript.

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.jsx            # Root layout: TelemetryBar + Navbar + Footer
│   ├── page.jsx              # / — Public Scholarship Registry
│   ├── loading.jsx           # Global loading skeleton
│   ├── not-found.jsx         # 404 page
│   ├── scanner/page.jsx      # /scanner — Forensic URL/Domain Scanner
│   ├── threats/page.jsx      # /threats — Threat Pattern Intelligence
│   ├── report/page.jsx       # /report — Report a Scam
│   ├── registry/page.jsx     # /registry — Database Registry
│   ├── verify/page.jsx       # /verify — Quick Link Verifier
│   └── api/
│       ├── scholarships/     # GET — paginated scholarship list
│       ├── scan/             # POST — fraud pattern analysis engine
│       ├── report/           # POST — submit scam report
│       └── stats/            # GET — live telemetry stats
├── components/
│   ├── layout/
│   │   ├── NavbarClient.jsx  # Sticky navbar with active route highlight
│   │   └── SiteFooter.jsx    # 4-col footer
│   ├── registry/
│   │   ├── RegistryHero.jsx  # Page hero + verification standard banner
│   │   ├── StatsBar.jsx      # 4-stat summary cards
│   │   ├── SearchToolbar.jsx # Search + filter + vector tags
│   │   ├── ScholarshipList.jsx # Scholarship cards with threat badges
│   │   ├── ForensicSidebar.jsx # Active case panel + 3-step checklist
│   │   └── RegistryClient.jsx  # Tabbed registry table
│   ├── scanner/
│   │   ├── ScannerForm.jsx   # URL/text input + live /api/scan integration
│   │   └── DiagnosticBenchmark.jsx
│   ├── threats/
│   │   └── ThreatsClient.jsx # Charts + pattern accordion + quiz
│   ├── report/
│   │   ├── ReportForm.jsx    # 4-section form with react-hook-form
│   │   └── ReportSidebar.jsx # Steps + recent takedowns + hotlines
│   └── verify/
│       └── VerifyClient.jsx  # Instant URL checker with risk badge
└── lib/
    └── data.js               # Mock data + helper functions
```

## 🚀 Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # Production build
```

## 📋 7-Day Development Plan

| Day | Focus | Status |
|-----|-------|--------|
| 1 | Setup + Navbar + Registry Homepage | ✅ Done |
| 2 | URL & Domain Scanner Page | ✅ Done |
| 3 | Threat Patterns + Report a Scam | ✅ Done |
| 4 | Database Registry + Verify a Link | ✅ Done |
| 5 | API Routes (scholarships, scan, report, stats) | ✅ Done |
| 6 | Python Analysis Engine + Real WHOIS | ⏳ Next |
| 7 | Auth + Admin Dashboard + Deployment | ⏳ Next |

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Live telemetry statistics |
| GET | `/api/scholarships?page=1&limit=10&status=ALL&q=` | Paginated scholarship list |
| POST | `/api/scan` | Analyze URL or text for fraud patterns |
| POST | `/api/report` | Submit a scam report |

## 🔍 Fraud Detection Patterns

The scanner detects:
- **Domain age** — < 180 days is flagged
- **High-risk TLDs** — `.biz`, `.info`, `.cc`, `.tk`, etc.
- **Fee keywords** — "processing fee", "courier fee", "registration fee", etc.
- **Coercion language** — "guaranteed", "pre-selected", "act now", "limited time"
- **Homoglyph domains** — Visual character substitution attacks
- **IRS 990 absence** — No nonprofit registration
- **Maildrop addresses** — CMRA / UPS Store registrations

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | JavaScript (JSX) |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Forms | React Hook Form |
| Icons | Lucide React |

