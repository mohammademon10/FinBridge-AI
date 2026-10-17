# FinBridge AI — Development Phases

**Approach:** Build a narrow vertical slice first, then harden and document it.  
**Team:** 2 members  
**Deadline context:** The stated competition deadline is October 20, 2026. Verify the official deadline and time zone before submission.

## Priority Labels
- **P0:** Must work for the MVP.
- **P1:** Important if time allows.
- **P2:** Defer until after submission.

## Phase 0 — Competition and Team Readiness (P0)
**Tasks**
- Confirm team eligibility and each member's enrollment evidence.
- Confirm latest official problem description, deliverables, recipient, and submission process.
- Complete registration form and prepare required member documents privately.
- Create GitHub repository and add the six planning files.

**Done when**
- Eligibility and requirements are checked.
- Registration package is ready or sent to the verified recipient.
- No sensitive registration documents are committed to Git.

## Phase 1 — Project Skeleton and Contracts (P0)
**Tasks**
- Create React/Vite/TypeScript frontend.
- Create FastAPI backend and `/health`.
- Configure `.env.example`, `.gitignore`, CORS, and local run instructions.
- Define Pydantic schemas and matching TypeScript types.
- Create a basic responsive dashboard shell.

**Done when**
- Frontend can call backend health endpoint.
- Both applications start from documented commands.
- No secret is required to run the basic demo.

## Phase 2 — Deterministic Finance Engine (P0)
**Tasks**
- Implement budget totals, funding gap, surplus, and monthly savings target.
- Implement currency conversion from a supplied rate.
- Define rounding and invalid-input behaviour.
- Add unit tests for normal, zero, invalid, and boundary cases.

**Done when**
- Core calculations are independent of the LLM.
- Tests pass and expected outputs are documented.
- Rates and assumptions are visible to the user.

## Phase 3 — Core Dashboard and Planner (P0)
**Tasks**
- Build student finance input form.
- Show expense breakdown, total estimated cost, available savings, and gap.
- Add tuition deadline and savings planner.
- Add at least two scenario comparisons.
- Implement loading, empty, success, and error states.

**Done when**
- A user can complete the budget workflow end to end.
- UI is responsive and values display with correct currency labels.
- No key control is a dead button.

## Phase 4 — AI Finance Agent (P0)
**Tasks**
- Define allowlisted tools: `analyze_budget`, `convert_currency`, `plan_tuition`.
- Implement structured tool inputs and outputs.
- Ask follow-up questions when required inputs are missing.
- Explain verified results, assumptions, and uncertainty.
- Provide a clearly labelled demo mode if LLM credentials are unavailable.

**Done when**
- At least three realistic prompts complete using verified tool outputs.
- The agent does not invent rates, fees, or transaction status.
- Tool loop is bounded and failures are handled.

## Phase 5 — Security, QA, and Evidence (P0)
**Tasks**
- Validate API inputs and response schemas.
- Review secret handling, CORS, logging, and data minimisation.
- Run backend tests and frontend production build.
- Prepare reproducible sandbox scenarios and operation logs.
- Record known limitations and security risks.

**Done when**
- Test results are recorded accurately.
- Demo scenarios can be replayed.
- Evidence contains no credentials or unnecessary personal data.

## Phase 6 — Competition Deliverables (P0)
**Tasks**
- Write technical documentation.
- Prepare a maximum 10-minute presentation, following the provided brief.
- Record an optional demo video of no more than 5 minutes, following the provided brief.
- Finalise README and installation/deployment instructions.
- Complete security self-assessment.
- Package sandbox evidence and links.

**Done when**
- All required deliverables are readable, consistent, and tested.
- Project links work for a reviewer.
- Latest official rules have been checked.

## Phase 7 — Final Submission (P0)
**Tasks**
- Verify the correct recipient and exact deadline/time zone.
- Run the app from a clean setup or documented environment.
- Check links, attachments, filenames, and team information.
- Send the project package before the deadline.
- Save sent-email evidence and receipt confirmation.

**Done when**
- Submission has been sent and receipt evidence is retained.
- Do not mark this phase complete based only on drafting an email.

## Deferred Work (P2)
- Real bank or remittance integrations.
- Real payment execution.
- Blockchain wallet.
- Complex multi-agent system.
- Mobile-native app.
- Extensive user authentication or production-scale multi-tenant features.

## Daily Team Check-in
At the end of each work session, record:
1. What was completed?
2. Which files changed?
3. Which tests/builds were run, and what was the actual result?
4. What is blocked?
5. What is the next smallest task?
6. Update `memory.md`.
