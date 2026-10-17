# FinBridge AI — Design System

**Design direction:** Trustworthy, modern, student-friendly fintech.  
**Visual character:** Calm, clear, data-led, polished; avoid a cluttered “AI dashboard” look.

## 1. Design Principles

1. Make the financial outcome obvious within five seconds.
2. Use clear labels and currency codes for every amount.
3. Keep the primary action visible and predictable.
4. Use charts to explain data, not as decoration.
5. Clearly distinguish user-provided estimates, illustrative data, and verified external data.
6. Design mobile and desktop layouts intentionally.
7. Accessibility and legibility are more important than animation.

## 2. Colour Tokens

Suggested starting palette; implement as CSS variables or Tailwind theme tokens.

| Token | Hex | Usage |
|---|---|---|
| `--color-primary` | `#2563EB` | Main actions, active navigation |
| `--color-primary-hover` | `#1D4ED8` | Hover/focus emphasis |
| `--color-accent` | `#06B6D4` | Secondary data highlight |
| `--color-background` | `#F8FAFC` | Light page background |
| `--color-surface` | `#FFFFFF` | Cards and panels |
| `--color-text` | `#0F172A` | Main text |
| `--color-muted` | `#64748B` | Secondary text |
| `--color-border` | `#E2E8F0` | Dividers and outlines |
| `--color-success` | `#15803D` | Positive status |
| `--color-warning` | `#B45309` | Warnings and assumptions |
| `--color-danger` | `#B91C1C` | Errors and funding shortfall |

Use semantic tokens rather than hardcoding colours throughout components. Verify contrast before final submission.

## 3. Dark Mode

If time allows, add a dark theme using semantic tokens:
- Background: `#0B1220`
- Surface: `#111827`
- Primary: `#60A5FA`
- Accent: `#22D3EE`
- Main text: `#F8FAFC`
- Muted text: `#94A3B8`
- Border: `#334155`

Do not delay core features to build theme switching. A polished light theme is sufficient for the MVP.

## 4. Typography

- Primary font: Inter.
- Fallback: `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- Use a readable base size of 16px.
- Body line height: approximately 1.5.
- Page title: 28–36px desktop; smaller responsive size on mobile.
- Section heading: 18–24px.
- Card title: 14–16px semibold.
- Labels and metadata: generally 12–14px, without making essential content too small.
- Use tabular numerals for financial amounts where available.

## 5. Layout and Spacing

- Use a consistent 4px-based spacing scale.
- Desktop dashboard: main content width around 1120–1280px.
- Use a clear page header and compact navigation.
- Summary metrics: 2–4 cards, not a wall of statistics.
- Main budget section: form/input panel paired with result summary on wide screens.
- Charts should have titles, legends, labels, and accessible text summaries.
- Mobile: stack cards and form controls vertically; prevent horizontal overflow.

## 6. Core Screens

### A. Dashboard
- Header: product name, selected scenario, demo-data notice.
- Summary cards: estimated cost, savings, funding gap, monthly target.
- Main area: expense breakdown chart and budget details.
- Primary CTA: “Analyze my budget”.
- Secondary action: “Compare scenario”.

### B. Finance Profile / Budget Form
- Group inputs into “Study costs”, “Available funds”, and “Planning deadline”.
- Display currency codes beside values.
- Show inline validation and example values.
- Include a “Load sample scenario” option.

### C. AI Assistant
- Chat-style question and answer area.
- Display which calculation/tool was used.
- Separate computed results from explanatory text.
- Show assumptions and data freshness.
- Never style an AI-generated estimate as verified fact.

### D. Tuition Planner
- Target amount, current savings, deadline, months remaining.
- Monthly savings target and timeline.
- Scenario comparison for changed costs or savings.
- Clear warning if the plan appears infeasible based on user-provided monthly capacity.

### E. Error and Empty States
- State what happened.
- Explain how to recover.
- Never expose stack traces or internal secrets.
- Do not show a successful state when a request failed.

## 7. Components

Create reusable components only where they help consistency:
- `AppShell`
- `PageHeader`
- `MetricCard`
- `CurrencyAmount`
- `BudgetForm`
- `ExpenseBreakdownChart`
- `FundingGapSummary`
- `ScenarioComparison`
- `AssistantPanel`
- `RateSourceBadge`
- `DataAssumptionNotice`
- `LoadingState`
- `ErrorState`
- `EmptyState`

## 8. Motion and Interaction

- Use subtle transitions (around 150–200ms) for hover/focus and panel changes.
- Avoid distracting continuous animations.
- Respect reduced-motion preferences.
- All controls must have real functionality.
- Provide keyboard focus indicators and accessible names.
- Do not use colour alone to indicate positive/negative status.

## 9. Content and Voice

Tone: supportive, direct, calm, and transparent.

Preferred examples:
- “Estimated funding gap”
- “Illustrative exchange rate”
- “Based on the information you entered”
- “You would need to save approximately €X per month under these assumptions.”

Avoid:
- “Guaranteed financial success”
- “This is the best investment”
- “Your payment has been completed” when only simulated
- “Live exchange rate” unless the rate source and freshness support that statement.

## 10. Responsive and Accessibility Checklist

- Test at narrow mobile, tablet, and desktop widths.
- Labels are connected to form fields.
- Keyboard navigation works.
- Focus indicators are visible.
- Text and controls meet suitable contrast.
- Errors are announced and explained clearly.
- Charts have text alternatives or summary values.
