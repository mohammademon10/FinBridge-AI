// TypeScript types matching FastAPI Pydantic schemas

export interface HealthResponse {
  status: string;
  app_name: string;
  version: string;
  environment: string;
  llm_configured: boolean;
  features: Record<string, boolean | string>;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}

export interface CostBreakdownItem {
  category: string;
  amount: string;
  percentage: number;
}

export interface BudgetAnalysisRequest {
  currency: string;
  tuition: string;
  living_costs: string;
  other_costs: string;
  available_savings: string;
  months_remaining?: number | null;
  monthly_savings_capacity?: string | null;
}

export interface BudgetAnalysisResponse {
  currency: string;
  total_estimated_cost: string;
  available_savings: string;
  funding_gap: string;
  surplus: string;
  months_remaining?: number | null;
  required_monthly_savings?: string | null;
  monthly_savings_capacity?: string | null;
  savings_capacity_shortfall?: string | null;
  is_feasible?: boolean | null;
  cost_breakdown: CostBreakdownItem[];
  assumptions: string[];
}

export interface CurrencyRate {
  pair: string;
  from_currency: string;
  to_currency: string;
  rate: string;
  source: string;
  timestamp: string;
  is_illustrative: boolean;
}

export interface CurrencyConversionRequest {
  amount: string;
  from_currency: string;
  to_currency: string;
  custom_rate?: string | null;
}

export interface CurrencyConversionResponse {
  source_amount: string;
  from_currency: string;
  to_currency: string;
  rate: string;
  converted_amount: string;
  rate_source: string;
  rate_timestamp: string;
  is_illustrative: boolean;
  assumptions: string[];
}

export interface TuitionPlannerRequest {
  currency: string;
  target_amount: string;
  available_savings: string;
  months_remaining: number;
  monthly_savings_capacity?: string | null;
  payment_deadline?: string | null;
}

export interface TuitionPlannerResponse {
  currency: string;
  target_amount: string;
  available_savings: string;
  funding_gap: string;
  months_remaining: number;
  payment_deadline?: string | null;
  required_monthly_savings: string;
  monthly_savings_capacity?: string | null;
  savings_capacity_shortfall?: string | null;
  status: 'achieved' | 'on_track' | 'shortfall';
  feasibility_message: string;
  assumptions: string[];
}

export interface ScenarioComparisonItem {
  label: string;
  total_cost: string;
  savings: string;
  gap: string;
  required_monthly: string;
  is_feasible: boolean;
}

export interface ScenarioComparisonRequest {
  currency: string;
  baseline_target: string;
  baseline_savings: string;
  baseline_months: number;
  baseline_capacity?: string | null;
  alternative_target: string;
  alternative_savings: string;
  alternative_months: number;
  alternative_capacity?: string | null;
}

export interface ScenarioComparisonResponse {
  currency: string;
  baseline: ScenarioComparisonItem;
  alternative: ScenarioComparisonItem;
  difference_gap: string;
  difference_monthly: string;
  summary: string;
}

export interface AgentToolResult {
  tool: string;
  inputs: Record<string, unknown>;
  outputs: Record<string, unknown>;
}

export interface AgentChatRequest {
  message: string;
  scenario_context?: Partial<BudgetAnalysisRequest> | null;
}

export interface AgentChatResponse {
  answer: string;
  tool_results: AgentToolResult[];
  assumptions: string[];
  mode: 'llm' | 'demo';
}

export interface Scenario {
  id: string;
  created_at: string;
  title: string;
  base_currency: string;
  target_currency?: string | null;
  tuition: string;
  living_costs: string;
  other_costs: string;
  available_savings: string;
  months_remaining?: number | null;
  monthly_savings_capacity?: string | null;
  calculation_result: Record<string, unknown>;
}
