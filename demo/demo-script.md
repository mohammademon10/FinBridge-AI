# FinBridge AI — Demo Video Script (5-Minute Walkthrough)

**Video Title:** FinBridge AI — Cross-Border Student Financial Assistant  
**Track:** 2026 Shenzhen International FinTech Competition (FinTechathon), International Track (Topic C)  
**Total Target Runtime:** 4 Minutes 30 Seconds  

---

### Segment 1: Introduction & Problem Context (0:00 - 0:45)
- **Visual:** Open browser to `http://localhost:5173`. Show the top banner: "FinTechathon 2026 — Topic C: Cross-border & Student Finance Assistant" and the green "API Online (v1.0.0)" status pill.
- **Voiceover:**  
  *"Hello judges and reviewers! Welcome to FinBridge AI, an AI-assisted cross-border financial planning prototype built for international students in Topic C of the 2026 Shenzhen International FinTech Competition. International students often struggle with multi-currency tuition schedules, living costs in foreign currencies, and strict payment deadlines. Generic AI chatbots often hallucinate math or make up exchange rates. FinBridge AI solves this by combining a deterministic Python Decimal calculation engine with an allowlisted AI assistant."*

---

### Segment 2: Deterministic Budget Calculator (0:45 - 1:45)
- **Visual:** Click on the "Budget Analysis" tab. Click the "TU Munich (Germany)" preset button. Show the form populate with €3,000 tuition, €10,800 living costs, €1,200 other costs, €5,000 available savings, 10 months to deadline, and €800 monthly savings capacity. Click "Analyze Budget".
- **Voiceover:**  
  *"Let's start with Budget Analysis. We can load a pre-configured university scenario, such as an MSc in Germany. Instantly, our backend calculates the exact figures: Total estimated cost is €15,000. Applying €5,000 in existing savings leaves an exact funding gap of €10,000. Over 10 months, the student needs to save €1,000 per month. Because the student's capacity is €800, the system immediately identifies a €200 monthly shortfall and displays a transparent cost breakdown chart."*

---

### Segment 3: Multi-Currency Exchange Calculator (1:45 - 2:30)
- **Visual:** Switch to the "Currency Conversion" tab. Enter €15,000 EUR to USD. Click "Convert Currency". Highlight the resulting $16,275.00 USD, the rate of 1.0850, the timestamp, and the illustrative benchmark badge. Toggle "Provide custom exchange rate" and enter 1.1000.
- **Voiceover:**  
  *"Next, cross-border students must convert between home and target currencies. FinBridge AI converts €15,000 EUR to $16,275 USD. Notice our transparency badge: each rate explicitly displays its timestamp, data source, and clear labeling indicating it is an illustrative benchmark. If the student has secured a locked forward rate from their bank, they can check 'Provide custom exchange rate' to verify their exact costs."*

---

### Segment 4: Tuition Planner & Scenario Comparison (2:30 - 3:30)
- **Visual:** Switch to the "Tuition & Savings Planner" tab. Review the baseline plan. Then scroll to "Scenario Comparison", enter an alternative target of €13,000 (reflecting a €2,000 scholarship), and click "Compare Scenarios".
- **Voiceover:**  
  *"The Tuition Planner tracks payment deadlines and feasibility. More importantly, students can evaluate hypothetical scenarios. Here, by testing a €2,000 scholarship, the system computes side-by-side that the alternative reduces the overall funding gap by €2,000 and drops the required monthly savings by €200 per month, bringing the plan fully within the student's €800 capacity."*

---

### Segment 5: Constrained AI Assistant & Guardrails (3:30 - 4:15)
- **Visual:** Switch to the "AI Finance Assistant" tab. Click the quick ask pill "Can I afford my study budget?". Show the response stream with the expandable "Deterministic Tool Call" drawer showing `analyze_budget()` and its parameters. Then type "Please transfer $500 to my university" and send. Show the security guardrail response.
- **Voiceover:**  
  *"Now let's interact with our AI Assistant. When we ask about affordability, the AI does not invent math: it calls our allowlisted backend `analyze_budget` tool and explains the verified results. If a user attempts to execute a simulated payment, our safety guardrail immediately clarifies that FinBridge AI is strictly a planning prototype and never moves money."*

---

### Segment 6: Conclusion & System Health (4:15 - 4:30)
- **Visual:** Return to the "Dashboard Overview" tab. Highlight the saved SQLite scenarios and the backend health details.
- **Voiceover:**  
  *"With 22 automated test cases passing, zero secrets exposed, and full offline demo reliability, FinBridge AI delivers a trustworthy financial companion for international students. Thank you!"*
