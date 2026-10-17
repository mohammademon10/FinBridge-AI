# FinBridge AI — Product Requirements Document (PRD)

**Project:** FinBridge AI  
**Competition track:** 2026 Shenzhen International FinTech Competition (FinTechathon), International Track  
**Selected topic:** Topic C — Cross-border & Student Finance Assistant  
**Status:** MVP specification  
**Team:** 2 members  
**Primary language:** English  
**Document version:** 1.0

## 1. Product Summary

FinBridge AI is an AI-assisted financial planning prototype for international students. It helps students estimate study-abroad costs, understand multi-currency budgets, identify tuition funding gaps, and create savings plans. The product combines deterministic financial calculations with an AI agent that explains verified results in plain English.

FinBridge AI is a planning and decision-support tool. It does not provide regulated financial advice, execute payments, or connect to real bank accounts.

## 2. Problem Statement

International students may need to coordinate tuition payments, accommodation, living expenses, exchange-rate assumptions, transfer fees, and payment deadlines. These costs can be difficult to compare when they are expressed in different currencies or spread across multiple deadlines.

FinBridge AI aims to bring these inputs into one clear workflow and explain the resulting budget position.

## 3. Target Users

### Primary user
- A prospective or current international student planning study-abroad expenses.

### Example use cases
- Estimate tuition and living costs for a chosen period.
- Convert an expense estimate between currencies.
- Calculate a funding gap from total estimated costs and available savings.
- Calculate a monthly savings target before a payment deadline.
- Ask the AI assistant to explain the calculations and compare hypothetical scenarios.

## 4. Product Goals

1. Deliver a working end-to-end MVP, not a static mockup.
2. Make financial calculations deterministic, transparent, and testable.
3. Clearly distinguish live/verified data from estimates and illustrative demo data.
4. Demonstrate an AI agent using approved financial tools rather than inventing arithmetic.
5. Produce reproducible sandbox/demo evidence and clear technical documentation.
6. Keep the interface accessible, responsive, and understandable to non-expert users.

## 5. Non-Goals

The MVP will not:
- Move real money or initiate remittances.
- Connect to real bank accounts or payment providers.
- Store passport scans, bank credentials, or unnecessary sensitive personal data.
- Offer guaranteed investment returns or personalized regulated financial advice.
- Build a blockchain wallet or on-chain transaction system.
- Attempt to support every country, currency, provider, or tax regime.
- Depend on complex multi-agent orchestration.

## 6. MVP Features and Acceptance Criteria

### F1 — Student Finance Profile
**Inputs:** destination country (optional), base currency, target currency, available savings, estimated tuition, living expenses, other expenses, expected payment date, and monthly savings capacity.

**Acceptance criteria**
- Required numeric inputs are validated and non-negative.
- Missing or invalid inputs produce helpful messages.
- The UI clearly labels currency for each amount.
- The app can run with a sample/demo profile without collecting real identity information.

### F2 — Budget Analysis
Calculate:
- Total estimated cost.
- Funding gap = max(total estimated cost − available savings, 0).
- Surplus = max(available savings − total estimated cost, 0).
- Required monthly savings = funding gap divided by the number of remaining months, with a documented rounding rule.
- If the deadline is missing or invalid, do not invent a monthly target.

**Acceptance criteria**
- The calculation engine is separate from the LLM.
- Calculations use Python `Decimal` or another explicit decimal-safe method.
- Tests cover zero, negative, missing, and boundary inputs.
- Results show assumptions and calculation details.

### F3 — Currency Conversion
**Acceptance criteria**
- Conversion requires a source amount, source currency, target currency, and a rate.
- Every rate has a source/label and timestamp when available.
- Demo rates are labelled “illustrative” and never presented as live market rates.
- If no trustworthy rate is available, the UI asks the user for a rate or uses clearly labelled demo data.
- The backend, not the LLM, performs the arithmetic.

### F4 — Tuition & Savings Planner
**Acceptance criteria**
- Users can view a payment target and deadline.
- The app shows the funding gap and required monthly saving based on explicit assumptions.
- Users can compare at least two hypothetical scenarios (for example, different living costs or savings amounts).
- The app does not claim a payment has been made.

### F5 — AI Finance Assistant
The assistant should:
1. Interpret the user's question.
2. Request missing information when necessary.
3. Call approved backend financial tools.
4. Explain the structured result and assumptions.
5. Avoid unsupported claims and guarantee-free language.

**Acceptance criteria**
- AI responses use results returned by backend tools.
- AI must not invent rates, fees, payment confirmations, or calculations.
- If the LLM provider is unavailable, a clearly labelled deterministic demo mode remains usable.
- Financial outputs include an estimate/assumption disclaimer where appropriate.

### F6 — Dashboard & Visualisation
Show:
- Total estimated cost.
- Available savings.
- Funding gap or surplus.
- Monthly savings target.
- Expense breakdown chart.
- Tuition deadline or savings timeline.

**Acceptance criteria**
- Core information is understandable without relying on colour alone.
- Layout works on desktop and mobile widths.
- Loading, empty, success, and error states are implemented.

### F7 — Sandbox Evidence
**Acceptance criteria**
- Include reproducible sample scenarios and operation logs.
- Logs do not contain secrets or unnecessary personal data.
- Evidence describes simulated operations accurately; no real transfer is implied.

## 7. Suggested User Journey

1. Open the dashboard.
2. Load the sample profile or enter a budget.
3. Select currencies and provide/confirm an exchange-rate assumption.
4. Run budget analysis.
5. Review funding gap and monthly savings target.
6. Ask the AI assistant to explain the result or compare a scenario.
7. Save/export or review the demo scenario and its assumptions.

## 8. Quality Requirements

- **Reliability:** Core calculations work without an LLM.
- **Security:** Secrets remain in environment variables; inputs are validated.
- **Privacy:** Collect only information needed for the scenario.
- **Transparency:** Show data source, rate timestamp, assumptions, and limitations.
- **Accessibility:** Labels, keyboard focus, readable contrast, and useful error text.
- **Maintainability:** Small modules, clear types/schemas, tests, and setup instructions.
- **Performance:** Core local demo actions should feel responsive; avoid unnecessary network calls.

## 9. Competition Deliverables Checklist

Confirm the latest official rules before submission. The current planned package is:
1. Technical documentation: architecture, components, algorithms, and security design.
2. Presentation deck (maximum 10 minutes, according to the provided competition brief).
3. Optional demo video (maximum 5 minutes, according to the provided brief).
4. Source code repository, README, setup/deployment instructions, and test cases.
5. Security self-assessment report.
6. Sandbox/simulated-account execution evidence and reproducible logs.

Registration documents are separate from the project deliverables. Do not commit passport bio pages, student IDs, or other sensitive documents to the repository.

## 10. Success Metrics

- A new user can complete the main budget workflow without assistance.
- All core financial calculation tests pass.
- The demo completes at least three documented scenarios.
- The AI explanation matches backend results and discloses assumptions.
- A reviewer can install and run the project using the README.
- No secrets or sensitive identity documents are present in the public repository.

## 11. Open Questions to Resolve Before Submission

- Confirm the exact required deliverables, formats, email recipient, and submission procedure from the latest official competition materials.
- Decide whether to use a live exchange-rate source or only labelled illustrative rates for the MVP.
- Confirm deployment availability and LLM provider limits.
- Confirm team eligibility and registration details.
