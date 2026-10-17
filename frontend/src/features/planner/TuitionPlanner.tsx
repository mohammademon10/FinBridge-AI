import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { TuitionPlannerResponse, ScenarioComparisonResponse } from '../../types/api';
import { 
  CalendarClock, 
  CheckCircle2, 
  AlertTriangle, 
  GitCompare, 
  TrendingUp,
  Sparkles
} from 'lucide-react';

export const TuitionPlanner: React.FC = () => {
  // Main planner inputs
  const [currency, setCurrency] = useState<string>('EUR');
  const [targetAmount, setTargetAmount] = useState<string>('16800.00');
  const [availableSavings, setAvailableSavings] = useState<string>('5000.00');
  const [months, setMonths] = useState<number>(10);
  const [capacity, setCapacity] = useState<string>('1000.00');
  const [deadline, setDeadline] = useState<string>('2027-08-01');

  const [loading, setLoading] = useState<boolean>(false);
  const [planResult, setPlanResult] = useState<TuitionPlannerResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Scenario Comparison States
  const [altTarget, setAltTarget] = useState<string>('14000.00');
  const [altSavings, setAltSavings] = useState<string>('6000.00');
  const [comparisonResult, setComparisonResult] = useState<ScenarioComparisonResponse | null>(null);
  const [compareLoading, setCompareLoading] = useState<boolean>(false);

  useEffect(() => {
    handleCalculatePlan();
    handleRunComparison();
  }, []);

  const handleCalculatePlan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.planTuition({
        currency,
        target_amount: targetAmount,
        available_savings: availableSavings,
        months_remaining: months,
        monthly_savings_capacity: capacity || null,
        payment_deadline: deadline || null,
      });
      setPlanResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Planning calculation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRunComparison = async () => {
    setCompareLoading(true);
    try {
      const comp = await api.compareScenarios({
        currency,
        baseline_target: targetAmount,
        baseline_savings: availableSavings,
        baseline_months: months,
        baseline_capacity: capacity || null,
        alternative_target: altTarget,
        alternative_savings: altSavings,
        alternative_months: months,
        alternative_capacity: capacity || null,
      });
      setComparisonResult(comp);
    } catch {
      // Comparison error handled gracefully
    } finally {
      setCompareLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <CalendarClock className="w-5 h-5 text-blue-600" />
          Tuition Timeline &amp; Savings Feasibility Planner
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Plan towards your tuition payment deadlines, verify monthly savings feasibility, and compare alternative budget strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form (5 cols) */}
        <form onSubmit={handleCalculatePlan} className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Baseline Plan Parameters</span>
            <span className="text-[11px] font-normal text-slate-400">Strict Decimal Rules</span>
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Months Remaining</label>
              <input
                type="number"
                min="1"
                max="120"
                value={months}
                onChange={(e) => setMonths(parseInt(e.target.value, 10) || 1)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Target Amount Needed ({currency})</label>
            <input
              type="text"
              required
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              placeholder="e.g. 16800.00"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Available Savings ({currency})</label>
            <input
              type="text"
              required
              value={availableSavings}
              onChange={(e) => setAvailableSavings(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              placeholder="e.g. 5000.00"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Monthly Capacity ({currency})</label>
              <input
                type="text"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                placeholder="e.g. 1000.00"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Target Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2 shadow-xs"
          >
            <CalendarClock className="w-4 h-4" />
            {loading ? "Evaluating..." : "Evaluate Tuition Plan"}
          </button>
        </form>

        {/* Results Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {planResult && (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium block">Monthly Savings Goal</span>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {planResult.currency} {planResult.required_monthly_savings}
                    <span className="text-xs font-normal text-slate-500 ml-1">/ month</span>
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                  planResult.status === 'achieved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : planResult.status === 'on_track'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}>
                  {planResult.status === 'achieved' && <CheckCircle2 className="w-4 h-4" />}
                  {planResult.status === 'on_track' && <TrendingUp className="w-4 h-4" />}
                  {planResult.status === 'shortfall' && <AlertTriangle className="w-4 h-4" />}
                  <span className="uppercase">{planResult.status.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Status explanation */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                {planResult.feasibility_message}
              </div>

              {/* Timeline metric items */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Funding Gap</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {planResult.currency} {planResult.funding_gap}
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Planning Horizon</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {planResult.months_remaining} Months
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Your Capacity</span>
                  <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                    {planResult.monthly_savings_capacity ? `${planResult.currency} ${planResult.monthly_savings_capacity}` : 'Unspecified'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Scenario Comparison Feature */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <GitCompare className="w-4 h-4 text-blue-600" />
                Scenario Comparison (Hypothetical Options)
              </h4>
              <button
                type="button"
                onClick={handleRunComparison}
                disabled={compareLoading}
                className="text-xs px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold transition-colors"
              >
                {compareLoading ? "Recalculating..." : "Compare Scenarios"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Alternative Target ({currency})
                </label>
                <input
                  type="text"
                  value={altTarget}
                  onChange={(e) => setAltTarget(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  placeholder="e.g. 14000.00 (Lower tuition or scholarship)"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-slate-500 mb-1">
                  Alternative Savings ({currency})
                </label>
                <input
                  type="text"
                  value={altSavings}
                  onChange={(e) => setAltSavings(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg"
                  placeholder="e.g. 6000.00"
                />
              </div>
            </div>

            {comparisonResult && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {/* Baseline Column */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-slate-700 block">Baseline Scenario</span>
                    <div className="text-slate-500">Gap: <strong className="text-slate-800">{currency} {comparisonResult.baseline.gap}</strong></div>
                    <div className="text-slate-500">Monthly: <strong className="text-slate-800">{currency} {comparisonResult.baseline.required_monthly}</strong></div>
                  </div>

                  {/* Alternative Column */}
                  <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
                    <span className="font-bold text-blue-900 block">Alternative Scenario</span>
                    <div className="text-slate-600">Gap: <strong className="text-blue-700">{currency} {comparisonResult.alternative.gap}</strong></div>
                    <div className="text-slate-600">Monthly: <strong className="text-blue-700">{currency} {comparisonResult.alternative.required_monthly}</strong></div>
                  </div>
                </div>

                {/* Difference Summary */}
                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Comparison Insight:</span>
                    {comparisonResult.summary}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
