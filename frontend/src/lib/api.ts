import type {
  HealthResponse,
  BudgetAnalysisRequest,
  BudgetAnalysisResponse,
  CurrencyConversionRequest,
  CurrencyConversionResponse,
  CurrencyRate,
  TuitionPlannerRequest,
  TuitionPlannerResponse,
  ScenarioComparisonRequest,
  ScenarioComparisonResponse,
  AgentChatRequest,
  AgentChatResponse,
  Scenario,
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorJson = await response.json();
          if (errorJson.error?.message) {
            errorMessage = errorJson.error.message;
          } else if (errorJson.detail) {
            errorMessage = typeof errorJson.detail === 'string'
              ? errorJson.detail
              : JSON.stringify(errorJson.detail);
          }
        } catch {
          // Response was not JSON
        }
        throw new Error(errorMessage);
      }

      return (await response.json()) as T;
    } catch (err: unknown) {
      if (err instanceof Error) {
        throw err;
      }
      throw new Error('An unknown network error occurred.');
    }
  }

  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  async analyzeBudget(data: BudgetAnalysisRequest): Promise<BudgetAnalysisResponse> {
    return this.request<BudgetAnalysisResponse>('/api/budget/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async convertCurrency(data: CurrencyConversionRequest): Promise<CurrencyConversionResponse> {
    return this.request<CurrencyConversionResponse>('/api/currency/convert', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRates(): Promise<CurrencyRate[]> {
    return this.request<CurrencyRate[]>('/api/currency/rates');
  }

  async planTuition(data: TuitionPlannerRequest): Promise<TuitionPlannerResponse> {
    return this.request<TuitionPlannerResponse>('/api/planner/tuition', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async compareScenarios(data: ScenarioComparisonRequest): Promise<ScenarioComparisonResponse> {
    return this.request<ScenarioComparisonResponse>('/api/planner/compare', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getScenarios(): Promise<Scenario[]> {
    return this.request<Scenario[]>('/api/scenarios');
  }

  async saveScenario(data: Omit<Scenario, 'id' | 'created_at'>): Promise<Scenario> {
    return this.request<Scenario>('/api/scenarios', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async chatWithAgent(data: AgentChatRequest): Promise<AgentChatResponse> {
    return this.request<AgentChatResponse>('/api/agent/chat', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const api = new ApiClient();
