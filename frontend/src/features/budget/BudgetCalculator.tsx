import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { BudgetAnalysisRequest, BudgetAnalysisResponse } from '../../types/api';
import { 
  Calculator, 
  AlertTriangle, 
  CheckCircle2, 
  Bookmark, 
  PieChart as PieIcon
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

interface Props {
  onAnalyzeComplete?: (data: BudgetAnalysisResponse, form: BudgetAnalysisRequest) => void;
}

const PRESET_SCENARIOS = [
  {
    label: "TU Munich (Germany)",
    currency: "EUR",
    tuition: "3000.00",
    living: "10800.00",
    other: "1200.00",
    savings: "5000.00",
    months: 10,
    capacity: "800.00"
  },
  {
    label: "Imperial College (UK)",
    currency: "GBP",
    tuition: "39500.00",
    living: "16500.00",
    other: "2000.00",
    savings: "20000.00",
    months: 12,
    capacity: "2500.00"
  },
  {
    label: "Univ of Toronto (Canada)",
    currency: "CAD",
    tuition: "32000.00",
    living: "14000.00",
    other: "1500.00",
    savings: "15000.00",
    months: 8,
    capacity: "4000.00"
  }
];

const CHART_COLORS = ['#2563EB', '#06B6D4', '#64748B'];

export const BudgetCalculator: React.FC<Props> = ({ onAnalyzeComplete }) => {
  const [currency, setCurrency] = useState<string>('EUR');
  const [tuition, setTuition] = useState<string>('9000.00');
  const [livingCosts, setLivingCosts] = useState<string>('7000.00');
  const [otherCosts, setOtherCosts] = useState<string>('800.00');
  const [savings, setSavings] = useState<string>('5000.00');
  const [months, setMonths] = useState<string>('10');
  const [capacity, setCapacity] = useState<string>('1000.00');

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<BudgetAnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  useEffect(() => {
    // Initial run on mount with default values
    handleAnalyze();
  }, []);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    setSaveSuccess(null);

    const payload: BudgetAnalysisRequest = {
      currency,
      tuition,
      living_costs: livingCosts,
      other_costs: otherCosts,
      available_savings: savings,
      months_remaining: months ? parseInt(months, 10) : null,
      monthly_savings_capacity: capacity || null,
    };

    try {
      const res = await api.analyzeBudget(payload);
      setResult(res);
      if (onAnalyzeComplete) {
        onAnalyzeComplete(res, payload);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Analysis failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (preset: typeof PRESET_SCENARIOS[0]) => {
    setCurrency(preset.currency);
    setTuition(preset.tuition);
    setLivingCosts(preset.living);
    setOtherCosts(preset.other);
    setSavings(preset.savings);
    setMonths(preset.months.toString());
    setCapacity(preset.capacity);
  };

  const handleSaveScenario = async () => {
    if (!result) return;
    try {
      const title = `Budget Scenario — ${currency} (${new Date().toLocaleDateString()})`;
      await api.saveScenario({
        title,
        base_currency: currency,
        tuition,
        living_costs: livingCosts,
        other_costs: otherCosts,
        available_savings: savings,
        months_remaining: months ? parseInt(months, 10) : null,
        monthly_savings_capacity: capacity || null,
        calculation_result: result as unknown as Record<string, unknown>,
      });
      setSaveSuccess("Scenario saved to SQLite store!");
      setTimeout(() => setSaveSuccess(null), 4000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save scenario');
    }
  };

  const chartData = result?.cost_breakdown.map((item) => ({
    name: item.category,
    amount: parseFloat(item.amount),
    percentage: item.percentage,
  })) || [];

  return (
    <div className="space-y-6">
      {/* Top Banner & Sample Presets */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-600" />
            Deterministic Budget Calculator
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Calculate your total study-abroad cost, identify funding shortfall, and compute required monthly savings.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-500 font-medium">Load preset:</span>
          {PRESET_SCENARIOS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => loadPreset(p)}
              className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (5 cols) */}
        <form onSubmit={handleAnalyze} className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Financial Parameters</span>
            <span className="text-[11px] font-normal text-slate-400">All fields validated</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
                <option value="CNY">CNY (¥)</option>
                <option value="HKD">HKD ($)</option>
                <option value="SGD">SGD ($)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Months to Deadline</label>
              <input
                type="number"
                min="1"
                max="120"
                value={months}
                onChange={(e) => setMonths(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                placeholder="e.g. 10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Estimated Tuition Fees ({currency})
            </label>
            <input
              type="text"
              required
              value={tuition}
              onChange={(e) => setTuition(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              placeholder="e.g. 9000.00"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Estimated Living &amp; Housing Costs ({currency})
            </label>
            <input
              type="text"
              required
              value={livingCosts}
              onChange={(e) => setLivingCosts(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              placeholder="e.g. 7000.00"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Other Costs (Flight, Visa, Insurance) ({currency})
            </label>
            <input
              type="text"
              value={otherCosts}
              onChange={(e) => setOtherCosts(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              placeholder="e.g. 800.00"
            />
          </div>

          <div className="pt-2 border-t border-slate-100">
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Available Savings Balance ({currency})
            </label>
            <input
              type="text"
              required
              value={savings}
              onChange={(e) => setSavings(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              placeholder="e.g. 5000.00"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Monthly Savings Capacity ({currency}/month)
            </label>
            <input
              type="text"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              placeholder="e.g. 1000.00"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{saveSuccess}</span>
            </div>
          )}

          <div className="pt-2 flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
            >
              <Calculator className="w-4 h-4" />
              {loading ? "Calculating..." : "Analyze Budget"}
            </button>
            <button
              type="button"
              onClick={handleSaveScenario}
              disabled={!result}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
              title="Save to SQLite database"
            >
              <Bookmark className="w-4 h-4" />
              Save
            </button>
          </div>
        </form>

        {/* Results and Visualizations (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {result ? (
            <>
              {/* Summary Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] text-slate-500 block">Total Est. Cost</span>
                  <span className="text-lg font-bold text-slate-900 mt-1 block">
                    {result.currency} {result.total_estimated_cost}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] text-slate-500 block">Available Savings</span>
                  <span className="text-lg font-bold text-emerald-600 mt-1 block">
                    {result.currency} {result.available_savings}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] text-slate-500 block">Funding Gap</span>
                  <span className={`text-lg font-bold mt-1 block ${result.funding_gap === '0.00' ? 'text-emerald-600' : 'text-red-600'}`}>
                    {result.currency} {result.funding_gap}
                  </span>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                  <span className="text-[11px] text-slate-500 block">Required Monthly</span>
                  <span className="text-lg font-bold text-indigo-600 mt-1 block">
                    {result.required_monthly_savings ? `${result.currency} ${result.required_monthly_savings}` : 'N/A'}
                  </span>
                </div>
              </div>

              {/* Feasibility Alert */}
              {result.is_feasible === true && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Budget Feasible:</span>
                    Your declared savings capacity ({result.currency} {result.monthly_savings_capacity}/mo) satisfies the required monthly target ({result.currency} {result.required_monthly_savings}/mo).
                  </div>
                </div>
              )}

              {result.is_feasible === false && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Monthly Funding Shortfall Identified:</span>
                    You need to save {result.currency} {result.required_monthly_savings}/mo, but your current capacity is {result.currency} {result.monthly_savings_capacity}/mo. 
                    Shortfall: <strong className="text-red-700">{result.currency} {result.savings_capacity_shortfall}/mo</strong>. Consider scholarship aid, part-time work, or reducing housing expenses.
                  </div>
                </div>
              )}

              {/* Visual Breakdown Chart */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <PieIcon className="w-4 h-4 text-blue-600" />
                  Expense Distribution &amp; Categorization
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="amount"
                        >
                          {chartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: any) => `${result.currency} ${Number(value).toFixed(2)}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2">
                    {result.cost_breakdown.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: CHART_COLORS[idx % CHART_COLORS.length] }}
                          />
                          <span className="font-medium text-slate-700">{item.category}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900 block">{result.currency} {item.amount}</span>
                          <span className="text-[10px] text-slate-400">{item.percentage}% of total</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Assumptions & Audit Metadata */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs text-slate-600">
                <span className="font-bold text-slate-700 block mb-1">Calculation Assumptions &amp; Method:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-500">
                  {result.assumptions.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            </>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
              <Calculator className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Enter budget parameters and click "Analyze Budget".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
