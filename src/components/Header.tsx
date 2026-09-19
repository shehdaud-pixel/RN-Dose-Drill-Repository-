import React from 'react';
import { Activity, Shuffle, Calculator, HelpCircle, CheckCircle2, XCircle, Grid } from 'lucide-react';

interface HeaderProps {
  currentIndex: number;
  totalQuestions: number;
  score: number;
  answeredCount: number;
  isShuffled: boolean;
  onToggleShuffle: () => void;
  onOpenCalculator: () => void;
  onOpenQuestionMap: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentIndex,
  totalQuestions,
  score,
  answeredCount,
  isShuffled,
  onToggleShuffle,
  onOpenCalculator,
  onOpenQuestionMap,
}) => {
  const scorePercent = answeredCount > 0 ? Math.round((score / answeredCount) * 100) : null;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-sky-100 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-600 to-blue-700 flex items-center justify-center text-white shadow-sm shadow-sky-500/20 ring-2 ring-sky-100">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">
                RN Dose <span className="text-sky-600">Drill</span>
              </span>
              <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-200">
                50 NCLEX Questions
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Clinical Medication Math Mastery</p>
          </div>
        </div>

        {/* Center/Right Info & Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Live Score Counter */}
          {answeredCount > 0 && (
            <div 
              id="header-live-score"
              className="hidden xs:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700"
              title="Current Accuracy"
            >
              <span className="text-slate-500">Score:</span>
              <span className="font-bold text-emerald-600">{score}</span>
              <span className="text-slate-400">/</span>
              <span className="font-semibold text-slate-800">{answeredCount}</span>
              {scorePercent !== null && (
                <span className={`ml-1 font-bold ${scorePercent >= 90 ? 'text-emerald-600' : scorePercent >= 75 ? 'text-amber-600' : 'text-rose-600'}`}>
                  ({scorePercent}%)
                </span>
              )}
            </div>
          )}

          {/* Shuffle Toggle */}
          <button
            id="header-shuffle-btn"
            onClick={onToggleShuffle}
            title={isShuffled ? 'Questions are shuffled. Click to reshuffle.' : 'Shuffle question order'}
            className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
              isShuffled 
                ? 'bg-sky-50 border-sky-300 text-sky-700 shadow-xs' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Shuffle className={`w-3.5 h-3.5 ${isShuffled ? 'text-sky-600' : 'text-slate-400'}`} />
            <span className="hidden sm:inline">{isShuffled ? 'Shuffled' : 'Shuffle'}</span>
          </button>

          {/* Clinical Calculator Button */}
          <button
            id="header-calc-btn"
            onClick={onOpenCalculator}
            title="Open Clinical Calculator"
            className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-xs transition-colors active:scale-95"
          >
            <Calculator className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">Calc</span>
          </button>

          {/* Question Map Overview */}
          <button
            id="header-map-btn"
            onClick={onOpenQuestionMap}
            title="View All 50 Questions Map"
            className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 transition-colors shadow-xs"
            aria-label="View Question Navigator"
          >
            <Grid className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
