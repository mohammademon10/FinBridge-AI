# FinBridge AI — Cross-Border Student Finance Assistant

> **2026 Shenzhen International FinTech Competition (FinTechathon)**  
> **Track:** International Track  
> **Topic:** Topic C — Cross-border & Student Finance Assistant  
> **Status:** Full MVP Prototype Tested, Documented & Verified (Phases 0 through 6)

FinBridge AI is an AI-assisted financial planning prototype designed specifically for international students. It empowers students and their families to estimate tuition and living costs, convert multi-currency budgets, identify tuition funding gaps, and plan monthly savings goals.

The system combines **deterministic financial calculations** (using Python `Decimal` arithmetic) with a **constrained AI agent** that orchestrates approved financial tools and explains results transparently without inventing figures.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite 8, Tailwind CSS v4, Recharts, Lucide Icons
- **Backend:** Python 3.13, FastAPI, Pydantic v2, Pytest, Uvicorn
- **Calculations:** Python standard `Decimal` (rounding rule: `ROUND_HALF_UP` to 2 decimal places)
- **Persistence:** SQLite for saved demo scenarios (`backend/app/finbridge.db`)
- **Architecture:** Decoupled client-server architecture with typed Pydantic/TypeScript contract schemas

---

## 📁 Repository Structure

```text
finbridge-ai/
├── README.md               # Project overview and setup guide
├── PRD.md                  # Product Requirements Document
├── architecture.md         # System architecture and API specifications
├── rules.md                # Development and financial safety guardrails
├── phases.md               # Priority roadmap and phase acceptance criteria
├── design.md               # Design system, color tokens, and UI guidelines
├── memory.md               # Verified session logs and project state
├── .gitignore              # Git ignore rules for Python, Node, DB, and secrets
├── .env.example            # Example environment configuration
├── frontend/               # React + Vite + TypeScript + Tailwind UI
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── types/api.ts    # TypeScript interfaces matching backend schemas
│       ├── lib/api.ts      # Typed API client
│       ├── features/
│       │   ├── budget/     # BudgetCalculator with Recharts visualizer
│       │   ├── currency/   # CurrencyConverter with benchmark rate table
│       │   ├── planner/    # TuitionPlanner & Scenario Comparison
│       │   └── assistant/  # AssistantChat with allowlisted tool drawer
│       ├── App.tsx         # Responsive dashboard shell and health monitor
│       └── index.css       # Tailwind v4 styles and color tokens
├── backend/                # FastAPI backend service
│   ├── requirements.txt    # Pinned backend dependencies
│   ├── app/
│   │   ├── main.py         # FastAPI application with CORS and error handlers
│   │   ├── core/           # Configuration and decimal arithmetic utilities
│   │   ├── schemas/        # Pydantic validation schemas
│   │   ├── services/       # Deterministic finance engines (budget, currency, planner)
│   │   ├── agent/          # Allowlisted tools and constrained assistant
│   │   ├── db/             # SQLite persistence with pre-seeded demo scenarios
│   │   └── api/            # API route controllers
│   └── tests/              # 22 automated test cases (Pytest)
├── docs/                   # Competition documentation package
│   ├── technical-documentation.md   # System architecture, algorithms, and contracts
│   ├── security-self-assessment.md  # Threat model and OWASP API review
│   └── system-architecture.mmd      # Mermaid architecture diagram
├── evidence/               # Reproducible sandbox evidence & execution logs
│   ├── scenarios/          # 4 JSON benchmark scenario payloads & outputs
│   └── logs/               # Verified pytest and build logs
├── presentation/           # Presentation materials
│   └── presentation-deck.md         # 10-minute pitch deck outline & speaker notes
└── demo/                   # Demo materials
    └── demo-script.md               # 5-minute narrated walkthrough script
```

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- Node.js (v18+) and npm
- Python (v3.11+)

### 1. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv .venv

# On Windows (PowerShell):
.venv\Scripts\Activate.ps1
# On Linux / macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run complete backend test suite (22 tests)
pytest

# Start the backend server (runs on http://localhost:8000)
uvicorn app.main:app --reload --port 8000
```

- Live Backend Health: [http://localhost:8000/health](http://localhost:8000/health)
- Interactive Swagger API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run production build check
npm run build

# Start Vite development server (runs on http://localhost:5173)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser. The application will connect directly to the FastAPI backend and display live health indicators.

---

## 🌐 Cloud Deployment (Vercel + Render)

The project includes ready-to-use production configurations for 1-click cloud deployment:

- **Frontend (Vercel):** Configured via [frontend/vercel.json](frontend/vercel.json). Set `VITE_API_BASE_URL` to your live backend URL.
- **Backend (Render):** Configured via [render.yaml](render.yaml). Runs FastAPI with production Uvicorn and CORS.
- **Containerized (Docker):** Full stack runnable via `docker compose up -d --build`.

👉 **See the complete step-by-step instructions in [docs/deployment-guide.md](docs/deployment-guide.md).**

---

## 🧪 Verified Automated Test Coverage

```text
======================== 22 passed, 3 warnings in 0.73s ========================
tests/test_agent.py ......................... [ 22%]
tests/test_budget.py ........................ [ 45%]
tests/test_currency.py ...................... [ 68%]
tests/test_health.py ........................ [ 77%]
tests/test_planner.py ....................... [ 90%]
tests/test_scenarios.py ..................... [100%]
```

- **Budget Engine:** Normal, surplus, zero cost, missing deadline, negative rejection, decimal precision rounding.
- **Currency Engine:** Illustrative rates, custom user rates, identity (1:1), negative rate rejection, rate list contract.
- **Tuition Planner:** Target feasibility, shortfall identification, achieved balance, baseline vs alternative scenario comparison.
- **AI Agent Guardrails:** Allowlisted tool dispatch, missing parameter clarification, real-money transfer interception.
- **Persistence:** SQLite scenario retrieval and creation.

---

## 🔒 Security & Privacy Guardrails

- **Zero Real Money Movement:** The prototype does not execute payments, initiate remittances, or connect to live banking credentials.
- **Deterministic Source of Truth:** The AI assistant never performs arithmetic directly. All monetary figures are calculated using deterministic backend services.
- **Zero Secrets in Repository:** No credentials, API keys, or private identity documents are tracked in Git.
- **Data Minimization:** No passport scans, student ID cards, or unnecessary personal data collected.

---

## 📄 Deliverables Summary

1. **Source Code & Working Prototype:** React 19 Frontend + FastAPI Backend
2. **Technical Documentation:** [docs/technical-documentation.md](docs/technical-documentation.md)
3. **Security Self-Assessment:** [docs/security-self-assessment.md](docs/security-self-assessment.md)
4. **System Architecture Diagram:** [docs/system-architecture.mmd](docs/system-architecture.mmd)
5. **Presentation Deck (10 min):** [presentation/presentation-deck.md](presentation/presentation-deck.md)
6. **Demo Video Script (5 min):** [demo/demo-script.md](demo/demo-script.md)
7. **Sandbox Execution Evidence:** [evidence/scenarios/](evidence/scenarios/) and [evidence/logs/](evidence/logs/)

---

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.
