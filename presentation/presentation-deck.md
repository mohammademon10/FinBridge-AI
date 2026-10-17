# FinBridge AI — Presentation Deck (10-Minute Pitch)

**Event:** 2026 Shenzhen International FinTech Competition (FinTechathon) — International Track  
**Category:** Topic C — Cross-border & Student Finance Assistant  
**Team:** FinBridge AI Engineering Team (2 Members)  
**Target Duration:** 8–10 Minutes  

---

## Slide 1: Title Slide (0:00 - 0:45)
- **Title:** FinBridge AI
- **Subtitle:** An AI-Assisted Deterministic Financial Planning Prototype for International Students
- **Track & Topic:** 2026 FinTechathon — Topic C (Cross-border & Student Finance Assistant)
- **Presenter Note:** Introduce team members, acknowledge the organizers, and state the mission: making international student budgeting transparent, testable, and stress-free.

---

## Slide 2: The International Student Problem (0:45 - 2:00)
- **Multi-Currency Fragmentation:** Tuition in EUR/GBP/CAD, family savings in CNY/USD, fluctuating exchange rates.
- **Deadline Pressure:** Unforgiving payment schedules where missing a semester payment leads to visa cancellation.
- **The "AI Math Hallucination" Danger:** Generic LLMs often fabricate calculations, invent rates, or miscalculate compound currency shortfalls.
- **Presenter Note:** Explain why students need a dedicated financial decision-support tool, not generic chat advice or complex corporate accounting software.

---

## Slide 3: The FinBridge AI Solution (2:00 - 3:30)
- **Dual-Engine Architecture:**
  1. *Deterministic Decimal Core:* Python `Decimal` arithmetic ensuring 100% mathematical accuracy.
  2. *Constrained AI Agent:* Interprets student questions and orchestrates allowlisted backend tools.
- **Core User Journey:**
  - Enter / load student profile → Deterministic budget evaluation → Multi-currency conversion → Tuition savings planner → Interactive AI consultation.

---

## Slide 4: System Architecture & Data Flow (3:30 - 4:45)
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS v4 + Recharts.
- **Backend:** FastAPI Gateway + Pydantic v2 Contract Validation.
- **Calculations:** Python standard `Decimal` with standard financial `ROUND_HALF_UP` rounding.
- **AI Agent Guardrails:** Strict allowlisted tool loop (`analyze_budget`, `convert_currency`, `plan_tuition`, `compare_scenarios`) + Transfer Interceptor that rejects simulated money movement.
- **Persistence:** SQLite for benchmark student scenarios.

---

## Slide 5: Core Financial Capabilities (4:45 - 6:15)
- **Feature 1: Budget Analysis Engine:**
  - Total Estimated Cost, Funding Gap, Surplus, and Required Monthly Savings.
  - Expense categorization chart (Tuition vs. Living vs. Miscellaneous).
- **Feature 2: Transparent Multi-Currency Conversion:**
  - Benchmark illustrative matrix with timestamps, rate sources, and user custom-rate overrides.
- **Feature 3: Tuition & Savings Feasibility Planner:**
  - Evaluates deadline horizon against declared monthly savings capacity. Identifies exact monthly shortfall.
  - Interactive Scenario Comparison: Baseline vs Alternative (e.g. scholarship aid or reduced housing).

---

## Slide 6: Live Product Demonstration Walkthrough (6:15 - 8:00)
- *Demo Walkthrough:*
  1. Load TU Munich MSc scenario (EUR 15,000 cost, EUR 5,000 savings, 10 months horizon).
  2. Review funding gap (EUR 10,000) and required monthly savings (EUR 1,000/mo vs EUR 800 capacity -> EUR 200/mo shortfall).
  3. Convert EUR costs into USD in real time.
  4. Compare with Alternative Scenario (EUR 2,000 scholarship) showing funding gap reduction.
  5. Ask the AI Assistant: "Can I afford my study budget for Germany?" and inspect the tool call.

---

## Slide 7: Security, Privacy & Compliance (8:00 - 9:00)
- **Zero Real Money Movement:** Strictly decision support; no live banking credentials or payment initiation.
- **Data Minimization:** No passport scans, student ID cards, or unnecessary personal data stored.
- **Zero Secrets in Git:** Strict `.env` management and public repository hygiene.
- **Verified QA:** 22/22 automated pytest tests passing; frontend production build passing with zero errors.

---

## Slide 8: Future Roadmap & Conclusion (9:00 - 10:00)
- **Phase 2 Expansion (Post-Competition):**
  - Live university tuition fee database indexing.
  - Automated scholarship matching engine.
  - Multi-student collective budget planning for flatmates.
- **Closing Statement:** FinBridge AI bridges cross-border financial uncertainty with deterministic precision and transparent AI guidance.
- **Q&A Invitation:** Thank the judges and open the floor for questions.
