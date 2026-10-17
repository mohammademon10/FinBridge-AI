import React, { useState } from 'react';
import { api } from '../../lib/api';
import type { AgentChatResponse, BudgetAnalysisRequest } from '../../types/api';
import { 
  Bot, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  Terminal, 
  CheckCircle2, 
  User
} from 'lucide-react';

interface Props {
  currentBudgetContext?: BudgetAnalysisRequest | null;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  toolResults?: AgentChatResponse['tool_results'];
  assumptions?: string[];
  mode?: 'llm' | 'demo';
}

const PRESET_QUESTIONS = [
  "Can I afford my study budget?",
  "Convert 5000 EUR to USD",
  "How much do I need to save each month?",
  "Compare an alternative with lower accommodation costs"
];

export const AssistantChat: React.FC<Props> = ({ currentBudgetContext }) => {
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Hello! I am your FinBridge AI Assistant. I operate using allowlisted backend calculation tools so all numbers are mathematically verified using Python Decimal arithmetic. How can I help with your study planning?",
      assumptions: [
        "All calculations performed deterministically by backend tools using Python Decimal.",
        "Prototype is for financial planning and decision support only (no real payment execution)."
      ],
      mode: 'demo',
    }
  ]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      const response = await api.chatWithAgent({
        message: textToSend,
        scenario_context: currentBudgetContext || undefined,
      });

      const assistantMsg: MessageItem = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        toolResults: response.tool_results,
        assumptions: response.assumptions,
        mode: response.mode,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errorMsg: MessageItem = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: `Error contacting assistant service: ${err instanceof Error ? err.message : 'Unknown error'}`,
        assumptions: ["Service unavailable."],
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputText);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            Constrained AI Finance Assistant
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Interprets questions and orchestrates approved backend calculation tools without inventing arithmetic.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Allowlisted Tools Enforced</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Conversation Area (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col h-[560px]">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-3 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-xl space-y-2 ${
                  m.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-2xl rounded-tr-xs px-4 py-3'
                    : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-2xl rounded-tl-xs px-4 py-3.5'
                }`}>
                  <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">{m.text}</p>

                  {/* Tool execution badge & details if tools were called */}
                  {m.toolResults && m.toolResults.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 uppercase tracking-wide">
                        <Terminal className="w-3.5 h-3.5 text-blue-600" />
                        <span>Deterministic Tool Call</span>
                      </div>
                      {m.toolResults.map((t, idx) => (
                        <div key={idx} className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs font-mono">
                          <div className="text-blue-700 font-bold mb-1">{t.tool}()</div>
                          <div className="text-[11px] text-slate-500 overflow-x-auto">
                            Result: {JSON.stringify(t.outputs, null, 1)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Assumptions */}
                  {m.assumptions && m.assumptions.length > 0 && (
                    <div className="text-[10px] text-slate-400 pt-1">
                      Assumptions: {m.assumptions.join(' • ')}
                    </div>
                  )}
                </div>

                {m.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                  Executing allowlisted backend financial tool...
                </div>
              </div>
            )}
          </div>

          {/* Quick preset pills */}
          <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex flex-wrap gap-1.5 overflow-x-auto">
            <span className="text-[11px] text-slate-400 font-medium py-1">Quick asks:</span>
            {PRESET_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => sendMessage(q)}
                className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Chat input form */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 bg-white rounded-b-2xl flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a financial planning question..."
              className="flex-1 text-xs sm:text-sm px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Send className="w-4 h-4" />
              <span>Send</span>
            </button>
          </form>
        </div>

        {/* Sidebar Info & Safety Guardrails (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Agent Guardrails &amp; Policy
            </h3>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>No Invented Math:</strong> Arithmetic is executed by Python Decimal backend tools.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>No Fake Payments:</strong> Guardrails reject prompts attempting to initiate remittances.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Clarifies Missing Inputs:</strong> Asks questions if parameters are underspecified.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Deterministic Demo Mode:</strong> Operates 100% reliably without requiring external LLM API tokens.</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50/60 p-5 rounded-2xl border border-blue-200 text-xs text-slate-700 space-y-2">
            <span className="font-bold text-blue-900 block flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Current Context Linked
            </span>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              The assistant receives the current active parameters from your Budget Calculator form (e.g. tuition, living expenses, savings balance).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
