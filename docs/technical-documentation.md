# FinBridge AI — Technical Documentation

**Project:** FinBridge AI  
**Competition Track:** 2026 Shenzhen International FinTech Competition (FinTechathon), International Track  
**Topic:** Topic C — Cross-border & Student Finance Assistant  
**Status:** MVP v1.0 Tested & Verified  
**Date:** October 2026  

---

## 1. Executive Summary

International students planning higher education abroad face multi-currency tuition schedules, complex living expenses, fluctuating exchange rates, and strict payment deadlines. Traditional financial tools are either oriented toward corporate finance or lack student-centric decision support.

**FinBridge AI** is an AI-assisted financial planning prototype designed specifically for international students. It combines **deterministic financial calculations** (implemented in Python with strict `Decimal` precision) with a **constrained AI agent** that orchestrates approved financial tools and explains results transparently without inventing figures or performing unverified math.

FinBridge AI is strictly a planning and decision-support prototype. It does not execute real-money payments, initiate remittances, or connect to live banking credentials.

---

## 2. Core Architecture & Design Principles

```
React 19 + TypeScript (Frontend)
       │ HTTP / JSON
       ▼
FastAPI Gateway & Pydantic v2 (Validation Layer)
       │
       ├──► Deterministic Finance Engine (Python Decimal, ROUND_HALF_UP)
       │     ├── Budget Analysis Service
       │     ├── Currency Conversion Service
       │     └── Tuition Planner & Scenario Comparator
       │
       ├──► Constrained AI Agent Engine
       │     ├── Allowlisted Tool Dispatcher (`analyze_budget`, `convert_currency`, etc.)
       │     ├── Financial Guardrail Interceptor (Blocks fake payments)
       │     └── Deterministic Fallback Mode (100% offline testability)
       │
       └──► SQLite Persistence Store (Demo scenarios & audit logs)
```

### Key Architectural Principles

1. **Deterministic Source of Truth:**
   The AI assistant is strictly forbidden from performing arithmetic. All calculations are executed by verified backend service functions using Python standard library `Decimal` with `ROUND_HALF_UP` rounding to 2 decimal places.
2. **Contract-Driven Type Safety:**
   Backend schemas are defined via Pydantic v2; matching TypeScript interfaces are enforced in the React client.
3. **Data Freshness & Rate Transparency:**
   Every currency conversion output includes the exact rate, timestamp, rate source label, and an `is_illustrative` flag to clearly distinguish demo benchmark data from live market quotes.
4. **Resilient Dual-Mode Execution:**
   The AI assistant features a complete deterministic rule-based tool parser that operates offline without third-party API dependencies, while seamlessly supporting OpenAI/Anthropic/Gemini API keys if configured.

---

## 3. Mathematical Formulations & Algorithms

### 3.1 Budget Analysis
Given user inputs:
- Tuition Fees: $T \ge 0$
- Living Expenses: $L \ge 0$
- Other Expenses: $O \ge 0$
- Available Savings: $S \ge 0$
- Planning Horizon (months): $M \ge 1$

1. **Total Estimated Cost:**
   $$\text{TotalCost} = T + L + O$$

2. **Funding Gap & Surplus:**
   $$\text{FundingGap} = \max(\text{TotalCost} - S, 0)$$
   $$\text{Surplus} = \max(S - \text{TotalCost}, 0)$$

3. **Required Monthly Savings:**
   $$\text{MonthlySavingsTarget} = \text{round}\left(\frac{\text{FundingGap}}{M}, \text{ROUND\_HALF\_UP}\right)$$
   *(If $M$ is omitted, the monthly target is explicitly not computed to prevent fabricated deadlines).*

4. **Savings Capacity Feasibility:**
   If user declares monthly capacity $C \ge 0$:
   $$\text{CapacityShortfall} = \max(\text{MonthlySavingsTarget} - C, 0)$$
   $$\text{IsFeasible} = (C \ge \text{MonthlySavingsTarget})$$

### 3.2 Currency Conversion
Given source amount $A$, source currency $C_{\text{src}}$, target currency $C_{\text{dst}}$, and rate $R$:
$$\text{ConvertedAmount} = \text{round}(A \times R, \text{ROUND\_HALF\_UP})$$

When $C_{\text{src}} = C_{\text{dst}}$, $R = 1.0000$ (Identity). When a direct pair is absent in the benchmark matrix, the engine computes the inverse: $R = \text{round}(1.0 / R_{\text{inv}}, \text{ROUND\_HALF\_UP})$.

### 3.3 Scenario Comparison
Compares Baseline $(\text{Gap}_B, \text{Monthly}_B)$ against Alternative $(\text{Gap}_A, \text{Monthly}_A)$:
$$\Delta \text{Gap} = \text{Gap}_B - \text{Gap}_A$$
$$\Delta \text{Monthly} = \text{Monthly}_B - \text{Monthly}_A$$

---

## 4. API Endpoints Specification

| Method | Endpoint | Description | Request Payload | Response Model |
|---|---|---|---|---|
| `GET` | `/health` | Service health & feature flag status | None | `HealthResponse` |
| `POST` | `/api/budget/analyze` | Deterministic budget analysis | `BudgetAnalysisRequest` | `BudgetAnalysisResponse` |
| `POST` | `/api/currency/convert` | Multi-currency conversion | `CurrencyConversionRequest` | `CurrencyConversionResponse` |
| `GET` | `/api/currency/rates` | List benchmark illustrative rates | None | `List[CurrencyRate]` |
| `POST` | `/api/planner/tuition` | Tuition savings & timeline planner | `TuitionPlannerRequest` | `TuitionPlannerResponse` |
| `POST` | `/api/planner/compare` | Compare two financial scenarios | `ScenarioComparisonRequest` | `ScenarioComparisonResponse` |
| `POST` | `/api/agent/chat` | Constrained AI Assistant chat | `AgentChatRequest` | `AgentChatResponse` |
| `GET` | `/api/scenarios` | List saved SQLite scenarios | None | `List[ScenarioResponse]` |
| `POST` | `/api/scenarios` | Save a scenario to SQLite | `ScenarioCreate` | `ScenarioResponse` |

---

## 5. Security & Safety Guardrails

- **Zero Secrets in Git:** Strict `.gitignore` prevents tracking `.env`, API keys, and SQLite database binaries.
- **Input Sanitization & Range Validation:** All amounts must be non-negative; currency codes must be normalized ISO symbols; infinite or NaN values are rejected at validation.
- **Payment Guardrail Interceptor:** The assistant actively intercepts keywords related to executing remittances, money movement, or banking credential capture, returning a safe compliance disclosure.
- **Standardized Error Handling:** No internal traceback or Python exception details are leaked to end users; all errors return `{ "error": { "code": "...", "message": "..." } }`.
