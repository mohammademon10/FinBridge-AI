import React, { useEffect, useState } from 'react';
import { api } from './lib/api';
import type { HealthResponse, BudgetAnalysisRequest, BudgetAnalysisResponse, Scenario } from './types/api';
import { 
  ShieldCheck, 
  Activity, 
  Calculator, 
  Coins, 
  CalendarClock, 
  Bot, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  Info,
  Bookmark,
  ArrowRight
} from 'lucide-react';
import { BudgetCalculator } from './features/budget/BudgetCalculator';
import { CurrencyConverter } from './features/currency/CurrencyConverter';
import { TuitionPlanner } from './features/planner/TuitionPlanner';
import { AssistantChat } from './features/assistant/AssistantChat';

export const App: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState<boolean>(true);
  const [healthError, setHealthError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'budget' | 'currency' | 'planner' | 'agent'>('dashboard');

  // Shared active budget state across features
  const [activeForm, setActiveForm] = useState<BudgetAnalysisRequest | null>({
    currency: "EUR",
    tuition: "9000.00",
    living_costs: "7000.00",
    other_costs: "800.00",
    available_savings: "5000.00",
    months_remaining: 10,
    monthly_savings_capacity: "1000.00",
  });
  const [latestAnalysis, setLatestAnalysis] = useState<BudgetAnalysisResponse | null>(null);
  const [savedScenarios, setSavedScenarios] = useState<Scenario[]>([]);

  useEffect(() => {
    checkHealth();
    loadScenarios();
  }, []);

  const checkHealth = async () => {
    setHealthLoading(true);
    setHealthError(null);
    try {
      const data = await api.getHealth();
      setHealth(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Backend unreachable';
      setHealthError(msg);
    } finally {
      setHealthLoading(false);
    }
  };

  const loadScenarios = async () => {
    try {
      const data = await api.getScenarios();
      setSavedScenarios(data);
    } catch {
      // Non-critical background fetch
    }
  };

  const handleBudgetAnalyzed = (res: BudgetAnalysisResponse, form: BudgetAnalysisRequest) => {
    setLatestAnalysis(res);
    setActiveForm(form);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Competition & Safety Banner */}
      <div className="bg-slate-900 text-slate-300 text-xs px-4 py-2 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
          <span className="font-medium text-white">FinTechathon 2026</span>
          <span className="text-slate-400">|</span>
          <span>International Track — Topic C: Cross-border &amp; Student Finance Assistant</span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            Deterministic Decimal Engine
          </span>
          <span className="text-slate-600">|</span>
          <span className="hidden sm:inline">No real bank accounts required</span>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              FB
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 leading-tight">FinBridge AI</h1>
                <span className="bg-blue-50 text-blue-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                  MVP v1.0
                </span>
              </div>
              <p className="text-xs text-slate-500">Cross-Border Student Financial Planning Assistant</p>
            </div>
          </div>

          {/* Backend Connectivity Status Pill */}
          <div className="flex items-center gap-2">
            {healthLoading ? (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs animate-pulse">
                <Activity className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                <span>Checking API...</span>
              </div>
            ) : health ? (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>API Online (v{health.version})</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>API Offline (Demo Mode Active)</span>
                <button
                  onClick={checkHealth}
                  className="underline hover:text-amber-900 ml-1 text-[11px]"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 sm:space-x-4 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Activity className="w-4 h-4" />
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('budget')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'budget'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Calculator className="w-4 h-4" />
            Budget Analysis
          </button>
          <button
            onClick={() => setActiveTab('currency')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'currency'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Coins className="w-4 h-4" />
            Currency Conversion
          </button>
          <button
            onClick={() => setActiveTab('planner')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'planner'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <CalendarClock className="w-4 h-4" />
            Tuition &amp; Savings Planner
          </button>
          <button
            onClick={() => setActiveTab('agent')}
            className={`py-3 px-3 sm:px-4 text-xs sm:text-sm font-medium border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
              activeTab === 'agent'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            <Bot className="w-4 h-4" />
            AI Finance Assistant
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Transparency / Disclaimers notice */}
        <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            <span className="font-semibold text-blue-900">Decision-Support &amp; Planning Prototype: </span>
            All financial calculations are computed deterministically on the backend using Python <code className="bg-blue-100 text-blue-800 px-1 py-0.5 rounded text-xs">Decimal</code> arithmetic. The AI assistant orchestrates approved mathematical tools and explains assumptions without inventing figures.
          </div>
        </div>

        {/* Dynamic View based on Active Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* High-Level Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Estimated Total Cost</span>
                  <Calculator className="w-4 h-4 text-blue-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {latestAnalysis ? `${latestAnalysis.currency} ${latestAnalysis.total_estimated_cost}` : "€ 16,800.00"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">Tuition + Living + Misc estimates</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Available Savings</span>
                  <Coins className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    {latestAnalysis ? `${latestAnalysis.currency} ${latestAnalysis.available_savings}` : "€ 5,000.00"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-emerald-600 font-medium">Current student fund balance</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Funding Gap</span>
                  <AlertCircle className="w-4 h-4 text-red-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-red-600">
                    {latestAnalysis ? `${latestAnalysis.currency} ${latestAnalysis.funding_gap}` : "€ 11,800.00"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-red-600 font-medium">Required additional funding</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
                  <span>Monthly Savings Target</span>
                  <CalendarClock className="w-4 h-4 text-indigo-500" />
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-indigo-600">
                    {latestAnalysis?.required_monthly_savings ? `${latestAnalysis.currency} ${latestAnalysis.required_monthly_savings}` : "€ 1,180.00"}
                  </span>
                  <span className="text-xs text-slate-500">/ month</span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {latestAnalysis?.months_remaining ? `${latestAnalysis.months_remaining} months to deadline` : "10 months until target deadline"}
                </p>
              </div>
            </div>

            {/* Quick Actions & Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Budget Analysis Engine</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Input your target tuition, living costs, and savings to calculate your funding gap and monthly targets with visual breakdowns.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('budget')}
                  className="mt-4 w-full py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Open Budget Analysis</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                    <Coins className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Currency Conversion</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Convert multi-currency budgets across EUR, USD, GBP, CAD, AUD, and CNY with transparent rate sources.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('currency')}
                  className="mt-4 w-full py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Open Currency Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                    <Bot className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">AI Finance Assistant</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Ask natural questions and let the assistant explain budget outcomes using approved deterministic backend tools.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('agent')}
                  className="mt-4 w-full py-2 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Chat with Assistant</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Saved SQLite Scenarios Section */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-blue-600" />
                  Reproducible Benchmark Demo Scenarios (SQLite Store)
                </h3>
                <span className="text-[11px] text-slate-400">
                  {savedScenarios.length} scenarios stored
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {savedScenarios.map((sc) => (
                  <div key={sc.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="font-bold text-xs text-slate-900 line-clamp-1">{sc.title}</div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between">
                      <span>Tuition: {sc.base_currency} {sc.tuition}</span>
                      <span>Savings: {sc.base_currency} {sc.available_savings}</span>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-200">
                      <span>Horizon: {sc.months_remaining} mo</span>
                      <button
                        onClick={() => {
                          setActiveForm({
                            currency: sc.base_currency,
                            tuition: sc.tuition,
                            living_costs: sc.living_costs,
                            other_costs: sc.other_costs,
                            available_savings: sc.available_savings,
                            months_remaining: sc.months_remaining,
                            monthly_savings_capacity: sc.monthly_savings_capacity,
                          });
                          setActiveTab('budget');
                        }}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Load Scenario →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Architecture Details */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                System Architecture &amp; Service Health
              </h3>
              {health ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block">Service Name</span>
                    <span className="font-semibold text-slate-800">{health.app_name}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block">Environment</span>
                    <span className="font-semibold text-slate-800 capitalize">{health.environment}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block">Arithmetic Engine</span>
                    <span className="font-semibold text-emerald-600">Python Decimal (2 DP)</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <span className="text-slate-400 block">Agent Mode</span>
                    <span className="font-semibold text-blue-600">
                      {health.llm_configured ? 'Live LLM Provider' : 'Deterministic Demo Mode'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  {healthError ? `Error reaching backend: ${healthError}` : 'Connecting to API server...'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Budget Calculator Tab */}
        {activeTab === 'budget' && (
          <BudgetCalculator onAnalyzeComplete={handleBudgetAnalyzed} />
        )}

        {/* Currency Converter Tab */}
        {activeTab === 'currency' && (
          <CurrencyConverter />
        )}

        {/* Tuition & Savings Planner Tab */}
        {activeTab === 'planner' && (
          <TuitionPlanner />
        )}

        {/* AI Assistant Chat Tab */}
        {activeTab === 'agent' && (
          <AssistantChat currentBudgetContext={activeForm} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 text-xs text-slate-500 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 FinBridge AI Team. Built for 2026 Shenzhen International FinTech Competition (FinTechathon).
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/mohammademon10/FinBridge-AI" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-slate-800">
              <ExternalLink className="w-3.5 h-3.5" />
              GitHub Repository
            </a>
            <span>•</span>
            <span className="text-slate-400">Deterministic Finance Prototype</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
