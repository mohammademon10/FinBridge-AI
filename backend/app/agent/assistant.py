import re
from typing import Dict, Any, List
from app.core.config import settings
from app.agent.tools import execute_tool
from app.schemas.agent import AgentChatRequest, AgentChatResponse, AgentToolResult

def process_agent_chat(request: AgentChatRequest) -> AgentChatResponse:
    """
    Main entrypoint for the AI Finance Assistant.
    Follows rules.md:
    1. Interprets query.
    2. Uses allowlisted tools for arithmetic.
    3. Transparently lists assumptions and avoids unsupported claims.
    4. Deterministic fallback mode when LLM credentials are not configured.
    """
    msg = request.message.strip().lower()
    ctx = request.scenario_context or {}

    tool_results: List[AgentToolResult] = []
    assumptions: List[str] = [
        "All calculations performed deterministically by backend tools using Python Decimal.",
        "Prototype is for financial planning and decision support only (no real payment execution)."
    ]

    # Guardrail check against simulated real-money movement
    transfer_keywords = ["send money", "transfer funds", "pay now", "move money", "wire payment", "execute transaction"]
    if any(k in msg for k in transfer_keywords):
        return AgentChatResponse(
            answer=(
                "FinBridge AI is a decision-support prototype. It does not execute payments, initiate remittances, "
                "or connect to real bank accounts. All outputs are deterministic planning estimates."
            ),
            tool_results=[],
            assumptions=assumptions,
            mode="demo" if not settings.LLM_API_KEY else "llm"
        )

    # 1. Currency conversion intent
    # Pattern: "convert 1000 eur to usd" or "how much is 500 usd in gbp"
    conv_match = re.search(r'(?:convert|exchange|what is|how much is)\s+([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z]{3})\s*(?:to|in|into)\s*([a-zA-Z]{3})', msg)
    if conv_match:
        amount_str = conv_match.group(1)
        from_cur = conv_match.group(2).upper()
        to_cur = conv_match.group(3).upper()

        args = {
            "amount": amount_str,
            "from_currency": from_cur,
            "to_currency": to_cur
        }
        res = execute_tool("convert_currency", args)
        tool_results.append(AgentToolResult(tool="convert_currency", inputs=args, outputs=res))
        
        answer = (
            f"At the exchange rate of {res['rate']} ({res['rate_source']}), "
            f"{res['source_amount']} {res['from_currency']} is equivalent to {res['converted_amount']} {res['to_currency']}. "
            f"{'Note: This rate is an illustrative benchmark for planning purposes.' if res['is_illustrative'] else ''}"
        )
        return AgentChatResponse(answer=answer, tool_results=tool_results, assumptions=res.get("assumptions", assumptions), mode="demo")

    # 2. Budget Analysis Intent
    # Pattern: user asking about affordability, budget gap, or providing numbers
    # Also check if numbers are in the message or provided in scenario_context
    has_budget_context = "tuition" in ctx and "living_costs" in ctx and "available_savings" in ctx
    has_budget_keywords = any(w in msg for w in ["afford", "budget", "gap", "shortfall", "tuition", "cost", "target", "living"])

    # Extract numbers if present in text: e.g. "tuition 9000, living 7000, savings 5000, 10 months"
    numbers = re.findall(r'([0-9]+(?:\.[0-9]+)?)', msg)
    
    if has_budget_keywords:
        # Check if user has sufficient numbers in text or context
        tuition = ctx.get("tuition")
        living = ctx.get("living_costs")
        savings = ctx.get("available_savings")
        currency = ctx.get("currency", "EUR")
        months = ctx.get("months_remaining", 10)
        capacity = ctx.get("monthly_savings_capacity")

        # Try to parse from numbers if context is missing
        if not has_budget_context and len(numbers) >= 3:
            tuition = numbers[0]
            living = numbers[1]
            savings = numbers[2]
            months = int(numbers[3]) if len(numbers) >= 4 else 10

        if tuition and living and savings:
            args = {
                "currency": currency,
                "tuition": str(tuition),
                "living_costs": str(living),
                "other_costs": str(ctx.get("other_costs", "0.00")),
                "available_savings": str(savings),
                "months_remaining": months,
                "monthly_savings_capacity": str(capacity) if capacity else None,
            }
            res = execute_tool("analyze_budget", args)
            tool_results.append(AgentToolResult(tool="analyze_budget", inputs=args, outputs=res))

            gap = res["funding_gap"]
            monthly = res["required_monthly_savings"]
            total = res["total_estimated_cost"]

            if res["funding_gap"] == "0.00":
                answer = (
                    f"Great news! Your estimated total costs of {total} {currency} are fully covered by "
                    f"your available savings of {res['available_savings']} {currency}, leaving a surplus of {res['surplus']} {currency}."
                )
            else:
                answer = (
                    f"Based on your estimated expenses, the total cost is {total} {currency}. "
                    f"After applying your current savings of {res['available_savings']} {currency}, you face an estimated "
                    f"funding gap of {gap} {currency}."
                )
                if monthly:
                    answer += f" Over {months} months, you will need to save approximately {monthly} {currency} per month to reach your goal."

            if res.get("is_feasible") is False:
                answer += f" Note: This target exceeds your declared monthly savings capacity by {res['savings_capacity_shortfall']} {currency}/month."

            return AgentChatResponse(
                answer=answer,
                tool_results=tool_results,
                assumptions=res.get("assumptions", assumptions),
                mode="demo"
            )
        else:
            # Missing inputs -> proactively ask for clarification as required by F5
            return AgentChatResponse(
                answer=(
                    "To calculate your study budget and funding gap, please provide: "
                    "1. Your estimated tuition fees, "
                    "2. Estimated living expenses (accommodation & meals), "
                    "3. Current available savings, and "
                    "4. Number of months until the payment deadline. "
                    "Alternatively, load one of the sample scenarios in the form above."
                ),
                tool_results=[],
                assumptions=["No calculation performed due to missing financial parameters."],
                mode="demo"
            )

    # 3. Scenario comparison intent
    if "compare" in msg or "alternative" in msg:
        if has_budget_context:
            args = {
                "currency": ctx.get("currency", "EUR"),
                "baseline_target": str(ctx.get("tuition", "10000")),
                "baseline_savings": str(ctx.get("available_savings", "2000")),
                "baseline_months": int(ctx.get("months_remaining", 10)),
                "alternative_target": str(float(ctx.get("tuition", "10000")) * 0.8),
                "alternative_savings": str(ctx.get("available_savings", "2000")),
                "alternative_months": int(ctx.get("months_remaining", 10)),
            }
            res = execute_tool("compare_scenarios", args)
            tool_results.append(AgentToolResult(tool="compare_scenarios", inputs=args, outputs=res))
            return AgentChatResponse(
                answer=f"Scenario Comparison: {res['summary']}",
                tool_results=tool_results,
                assumptions=assumptions,
                mode="demo"
            )

    # Default conversational response explaining capabilities
    return AgentChatResponse(
        answer=(
            "Hello! I am your FinBridge AI Assistant. I can help you evaluate study-abroad budgets, "
            "calculate your funding gap, determine required monthly savings, convert multi-currency expenses, "
            "and compare alternative financial scenarios. How can I assist with your planning today?"
        ),
        tool_results=[],
        assumptions=assumptions,
        mode="demo"
    )
