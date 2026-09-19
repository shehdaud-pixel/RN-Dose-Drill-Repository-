import React, { useState } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  Shuffle, 
  CheckCircle2, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Award, 
  AlertTriangle,
  ArrowRight,
  Filter,
  Stethoscope,
  BookOpen
} from 'lucide-react';
import { Question, UserAnswer } from '../types';

interface QuizSummaryProps {
  questions: Question[];
  userAnswers: Record<number, UserAnswer>;
  onRestart: (shuffle: boolean) => void;
  onRetakeMissed: (missedQuestions: Question[]) => void;
}

export const QuizSummary: React.FC<QuizSummaryProps> = ({
  questions,
  userAnswers,
  onRestart,
  onRetakeMissed,
}) => {
  const [filter, setFilter] = useState<'all' | 'missed' | 'correct'>('all');
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
  const missedCount = totalQuestions - correctCount;
  const scorePercent = Math.round((correctCount / totalQuestions) * 100);

  // NCLEX / Nursing school passing threshold
  const isPassing = scorePercent >= 90; // Standard nursing dosage exams require 90% or 100%
  const isPerfect = scorePercent === 100;

  // Category breakdown calculation
  const categoryStats: Record<string, { total: number; correct: number; label: string }> = {};
  questions.forEach(q => {
    if (!categoryStats[q.category]) {
      categoryStats[q.category] = { total: 0, correct: 0, label: q.categoryLabel };
    }
    categoryStats[q.category].total += 1;
    if (userAnswers[q.id]?.isCorrect) {
      categoryStats[q.category].correct += 1;
    }
  });

  const missedQuestionsList = questions.filter(q => !userAnswers[q.id] || !userAnswers[q.id].isCorrect);

  const filteredQuestions = questions.filter(q => {
    const ans = userAnswers[q.id];
    if (filter === 'missed') return !ans || !ans.isCorrect;
    if (filter === 'correct') return ans && ans.isCorrect;
    return true;
  });

  const toggleExpand = (id: number) => {
    setExpandedQuestionId(prev => prev === id ? null : id);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Banner & Score Card */}
      <div 
        id="quiz-results-banner"
        className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden"
      >
        <div className={`px-6 py-8 text-center text-white ${
          isPassing 
            ? 'bg-gradient-to-br from-emerald-600 to-teal-700' 
            : scorePercent >= 75
            ? 'bg-gradient-to-br from-sky-600 to-blue-700'
            : 'bg-gradient-to-br from-slate-800 to-rose-900'
        }`}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md mb-4 ring-4 ring-white/20">
            {isPerfect ? (
              <Trophy className="w-9 h-9 text-amber-300" />
            ) : isPassing ? (
              <Award className="w-9 h-9 text-emerald-200" />
            ) : (
              <AlertTriangle className="w-9 h-9 text-amber-300" />
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isPerfect
              ? 'Flawless 100%! Dosage Calculation Master!'
              : isPassing
              ? 'Exam Passed! High-Yield NCLEX Proficiency'
              : 'Drill Complete — Remediation Recommended'}
          </h1>

          <p className="text-sm text-white/90 max-w-lg mx-auto mt-2 leading-relaxed">
            {isPassing
              ? 'Outstanding performance! You met or exceeded the rigorous 90% benchmark required by clinical nursing programs.'
              : 'Dosage exams often require 90% or 100% mastery to administer medications safely. Review your missed calculations below and re-drill.'}
          </p>

          {/* Big Score Gauge */}
          <div className="mt-6 inline-flex items-baseline space-x-2 px-6 py-3 rounded-2xl bg-black/20 backdrop-blur-md border border-white/20">
            <span className="text-4xl sm:text-5xl font-extrabold font-mono tracking-tight">{scorePercent}%</span>
            <span className="text-base text-white/80 font-medium">({correctCount} / {totalQuestions} Correct)</span>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="p-5 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-center gap-3">
          <button
            id="summary-restart-shuffle-btn"
            onClick={() => onRestart(true)}
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold shadow-sm shadow-sky-600/20 active:scale-95 transition-all"
          >
            <Shuffle className="w-4 h-4" />
            <span>Shuffle & Drill All 50</span>
          </button>

          {missedQuestionsList.length > 0 && (
            <button
              id="summary-retake-missed-btn"
              onClick={() => onRetakeMissed(missedQuestionsList)}
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-sm shadow-rose-600/20 active:scale-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Drill Missed Questions ({missedQuestionsList.length})</span>
            </button>
          )}

          <button
            id="summary-restart-order-btn"
            onClick={() => onRestart(false)}
            className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-sm font-semibold active:scale-95 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retake in Sequential Order</span>
          </button>
        </div>
      </div>

      {/* Category Performance Breakdown Grid */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-sky-600" />
            <h2 className="font-bold text-slate-900 text-base">Category Performance Mastery</h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Target: ≥ 90%</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3.5">
          {Object.entries(categoryStats).map(([key, stat]) => {
            const pct = Math.round((stat.correct / stat.total) * 100);
            const isCatPassed = pct >= 90;

            return (
              <div key={key} className="p-3.5 rounded-xl border border-slate-150 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800">{stat.label}</span>
                  <span className={`font-bold font-mono ${isCatPassed ? 'text-emerald-700' : 'text-rose-700'}`}>
                    {stat.correct}/{stat.total} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all ${isCatPassed ? 'bg-emerald-500' : pct >= 70 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question by Question Review & Step-by-Step Rationales */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-sky-600" />
            <h2 className="font-bold text-slate-900 text-base">Detailed Question Review & Rationales</h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center space-x-1 p-1 bg-white border border-slate-200 rounded-xl text-xs font-semibold">
            <button
              id="filter-all-btn"
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'all' ? 'bg-sky-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All (50)
            </button>
            <button
              id="filter-missed-btn"
              onClick={() => setFilter('missed')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'missed' ? 'bg-rose-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Missed ({missedCount})
            </button>
            <button
              id="filter-correct-btn"
              onClick={() => setFilter('correct')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filter === 'correct' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Correct ({correctCount})
            </button>
          </div>
        </div>

        {/* List of reviewed questions */}
        <div className="divide-y divide-slate-100">
          {filteredQuestions.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No questions found under this filter.
            </div>
          ) : (
            filteredQuestions.map((q, idx) => {
              const ans = userAnswers[q.id];
              const isCorrect = ans?.isCorrect;
              const isExpanded = expandedQuestionId === q.id;

              return (
                <div key={q.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
                  <div 
                    onClick={() => toggleExpand(q.id)}
                    className="flex items-start justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-start space-x-3 min-w-0">
                      <div className={`mt-0.5 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-white text-xs font-bold ${
                        isCorrect ? 'bg-emerald-500' : 'bg-rose-500'
                      }`}>
                        {isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-500">#{q.id}</span>
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {q.categoryLabel}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 leading-snug">
                          {q.order} — {q.prompt}
                        </p>
                        <div className="text-xs flex flex-wrap gap-x-4 gap-y-1 pt-0.5">
                          <span className={isCorrect ? 'text-emerald-700 font-semibold' : 'text-rose-700 font-semibold'}>
                            Your Answer: {ans ? q.options[ans.selectedOptionIndex] : 'Unanswered'}
                          </span>
                          {!isCorrect && (
                            <span className="text-emerald-700 font-semibold">
                              Correct: {q.options[q.correctIndex]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Expanded Rationale details */}
                  {isExpanded && (
                    <div className="mt-4 pt-3 border-t border-slate-150 pl-9 space-y-2.5 text-xs sm:text-sm animate-in fade-in duration-150">
                      <div className="bg-slate-100 rounded-xl p-3 text-slate-800 space-y-1">
                        <div className="text-xs font-bold text-slate-600">Medication on Hand / Supply:</div>
                        <div className="font-medium text-slate-900">{q.supply}</div>
                      </div>

                      <div className="bg-sky-50/70 border border-sky-200/70 rounded-xl p-3.5 space-y-2">
                        <div className="font-bold text-sky-900 flex items-center space-x-1.5">
                          <span>Calculation Steps & Rationale:</span>
                          <span className="text-xs font-mono font-normal text-sky-700">({q.formula})</span>
                        </div>
                        <div className="font-mono text-xs whitespace-pre-line text-slate-800 leading-relaxed">
                          {q.rationale}
                        </div>
                      </div>

                      {q.clinicalTip && (
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-amber-900 text-xs">
                          <span className="font-bold">Clinical Pearl: </span>
                          <span>{q.clinicalTip}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
