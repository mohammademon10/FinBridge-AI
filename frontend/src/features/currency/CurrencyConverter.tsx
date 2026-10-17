import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import type { CurrencyConversionResponse, CurrencyRate } from '../../types/api';
import { 
  Coins, 
  ArrowRightLeft, 
  Info, 
  AlertTriangle, 
  Clock 
} from 'lucide-react';

const COMMON_CURRENCIES = ["EUR", "USD", "GBP", "CAD", "AUD", "CNY", "HKD", "SGD", "JPY"];

export const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<string>('5000.00');
  const [fromCurrency, setFromCurrency] = useState<string>('EUR');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [useCustomRate, setUseCustomRate] = useState<boolean>(false);
  const [customRate, setCustomRate] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<CurrencyConversionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [ratesList, setRatesList] = useState<CurrencyRate[]>([]);

  useEffect(() => {
    handleConvert();
    loadRates();
  }, []);

  const loadRates = async () => {
    try {
      const data = await api.getRates();
      setRatesList(data);
    } catch {
      // Non-critical background load
    }
  };

  const handleConvert = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.convertCurrency({
        amount,
        from_currency: fromCurrency,
        to_currency: toCurrency,
        custom_rate: useCustomRate && customRate ? customRate : null,
      });
      setResult(res);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Conversion failed');
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    const prevFrom = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(prevFrom);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Coins className="w-5 h-5 text-blue-600" />
          Multi-Currency Exchange Calculator
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Estimate tuition and living expenses across multiple currencies with transparent rate sources and decimal precision.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Converter Form (6 cols) */}
        <form onSubmit={handleConvert} className="lg:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Conversion Settings</span>
            <span className="text-[11px] font-normal text-slate-400">Strict Decimal Math</span>
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Source Amount</label>
            <input
              type="text"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full text-sm font-semibold px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              placeholder="e.g. 5000.00"
            />
          </div>

          <div className="grid grid-cols-5 items-center gap-2">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">From</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {COMMON_CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="col-span-1 flex justify-center pt-5">
              <button
                type="button"
                onClick={swapCurrencies}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                title="Swap currencies"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">To</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              >
                {COMMON_CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Custom Rate Toggle */}
          <div className="pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={useCustomRate}
                onChange={(e) => setUseCustomRate(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="font-medium">Provide custom exchange rate</span>
            </label>

            {useCustomRate && (
              <div className="mt-2">
                <input
                  type="text"
                  value={customRate}
                  onChange={(e) => setCustomRate(e.target.value)}
                  placeholder="e.g. 1.0920"
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Useful if you have locked in a forward quote or bank rate.
                </span>
              </div>
            )}
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
            <Coins className="w-4 h-4" />
            {loading ? "Calculating..." : "Convert Currency"}
          </button>
        </form>

        {/* Results Panel (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          {result ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div>
                <span className="text-xs text-slate-400 block font-medium">Converted Value</span>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-blue-600">
                    {result.converted_amount}
                  </span>
                  <span className="text-base font-bold text-slate-700">{result.to_currency}</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  from {result.source_amount} {result.from_currency}
                </p>
              </div>

              {/* Rate Metadata Badge */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Applied Rate:</span>
                  <span className="font-mono font-bold text-slate-800">
                    1 {result.from_currency} = {result.rate} {result.to_currency}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Rate Source:</span>
                  <span className="font-medium text-slate-700">{result.rate_source}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Rate Type:</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                    result.is_illustrative 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {result.is_illustrative ? "Illustrative Demo Rate" : "User-Specified Rate"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Timestamp:
                  </span>
                  <span>{new Date(result.rate_timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* Transparency Notice */}
              <div className="text-[11px] text-slate-500 bg-blue-50/50 p-3 rounded-lg border border-blue-100 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>
                  Foreign exchange rates fluctuate continuously. In accordance with competition rules, 
                  benchmark rates are clearly labelled as illustrative and not represented as live market executable quotes.
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-400">
              <Coins className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Enter amount and choose currencies to convert.</p>
            </div>
          )}

          {/* Benchmark Rates Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Benchmark Illustrative Rates Matrix</span>
              <span className="text-[10px] font-normal text-slate-400">Reference only</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {ratesList.slice(0, 9).map((r, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="font-bold text-slate-800 block">{r.pair}</span>
                  <span className="font-mono text-blue-600 text-xs block">{r.rate}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
