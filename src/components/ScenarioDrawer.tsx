import React from 'react';
import { Sparkles, X, Play, CheckCircle2, ArrowRight } from 'lucide-react';
import { TestScenario, BusinessPreset } from '../types';

interface ScenarioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  scenarios: TestScenario[];
  businesses: BusinessPreset[];
  onSelectScenario: (scenario: TestScenario) => void;
}

export const ScenarioDrawer: React.FC<ScenarioDrawerProps> = ({
  isOpen,
  onClose,
  scenarios,
  businesses,
  onSelectScenario
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">24/7 Chatbot Test Scenarios</h2>
              <p className="text-xs text-slate-500">1-click prompts across all 3 service pillars</p>
            </div>
          </div>
          <button
            id="btn-close-scenarios"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scenarios List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          <div className="text-[11px] text-slate-500 mb-2">
            Select any scenario to automatically switch context and test how the 24/7 AI chatbot handles inquiries, bookings, and customer sentiment feedback:
          </div>

          {scenarios.map((sc) => {
            const targetBiz = businesses.find((b) => b.id === sc.targetBusinessId);
            const categoryBadge =
              sc.category === 'booking'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : sc.category === 'feedback'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : 'bg-sky-50 text-sky-800 border-sky-200';

            return (
              <div
                key={sc.id}
                id={`scenario-card-${sc.id}`}
                onClick={() => {
                  onSelectScenario(sc);
                  onClose();
                }}
                className="group p-3.5 bg-slate-50 hover:bg-white border border-slate-200 hover:border-emerald-300 rounded-xl cursor-pointer transition-all shadow-2xs hover:shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-md border ${categoryBadge}`}>
                    {sc.category}
                  </span>
                  {targetBiz && (
                    <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
                      <span>{targetBiz.avatar}</span>
                      <span>{targetBiz.name}</span>
                    </span>
                  )}
                </div>

                <div className="text-xs font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {sc.title}
                </div>

                <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                  {sc.description}
                </div>

                <div className="mt-2.5 p-2 bg-white group-hover:bg-emerald-50/50 border border-slate-200/80 group-hover:border-emerald-200 rounded-lg text-xs font-mono text-slate-700 line-clamp-2 flex items-center justify-between">
                  <span className="truncate">"{sc.userMessage}"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0 ml-2" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-xs text-slate-500 flex items-center justify-between">
          <span>Powered by Gemini 24/7 AI Engine</span>
          <span className="font-mono text-emerald-600 font-semibold">Response: &lt; 1.0s</span>
        </div>
      </div>
    </div>
  );
};
