import React, { useEffect } from 'react';
import { 
  FileText, 
  Package, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Calculator, 
  Lightbulb, 
  Check, 
  X,
  Stethoscope
} from 'lucide-react';
import { Question, UserAnswer } from '../types';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  userAnswer?: UserAnswer;
  onSelectOption: (optionIndex: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  onOpenCalculator: () => void;
  canGoPrevious: boolean;
  isLastQuestion: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  userAnswer,
  onSelectOption,
  onNext,
  onPrevious,
  onOpenCalculator,
  canGoPrevious,
  isLastQuestion,
}) => {
  const isAnswered = !!userAnswer;
  const isCorrect = userAnswer?.isCorrect;

  // Keyboard shortcut listener for options (1-4 or A-D) and Enter for next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (!isAnswered) {
        if (e.key === '1' || e.key.toLowerCase() === 'a') onSelectOption(0);
        else if (e.key === '2' || e.key.toLowerCase() === 'b') onSelectOption(1);
        else if (e.key === '3' || e.key.toLowerCase() === 'c') onSelectOption(2);
        else if (e.key === '4' || e.key.toLowerCase() === 'd') onSelectOption(3);
      } else {
        if (e.key === 'Enter' || e.key === 'ArrowRight') {
          onNext();
        } else if (e.key === 'ArrowLeft' && canGoPrevious) {
          onPrevious();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAnswered, onSelectOption, onNext, onPrevious, canGoPrevious]);

  const optionLetters = ['A', 'B', 'C', 'D'];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 sm:space-y-6">
      {/* Question Card Box */}
      <div 
        id={`question-card-${question.id}`}
        className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden transition-all duration-200"
      >
        {/* Card Header: Category & Info */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-sky-50/70 via-slate-50 to-white border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-800 border border-sky-200">
              <Stethoscope className="w-3 h-3 mr-1 text-sky-600" />
              {question.categoryLabel}
            </span>
            <span className="text-xs text-slate-500 font-mono">ID: #{question.id}</span>
          </div>

          <div className="flex items-center space-x-3 text-xs text-slate-500">
            <button
              onClick={onOpenCalculator}
              className="inline-flex items-center text-sky-700 hover:text-sky-800 font-medium hover:underline cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5 mr-1 text-sky-600" />
              Dosage Calc
            </button>
            <span>•</span>
            <span>Single Screen Mode</span>
          </div>
        </div>

        {/* Clinical Scenario Section */}
        <div className="p-5 sm:p-7 space-y-4">
          <div className="grid sm:grid-cols-2 gap-3">
            {/* Physician's Order */}
            <div className="bg-sky-50/70 border border-sky-200/70 rounded-xl p-3.5 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 shadow-xs">
                Rx
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[11px] font-bold text-sky-900 uppercase tracking-wider block">
                  Provider's Prescription Order
                </span>
                <p className="text-sm font-semibold text-slate-900 leading-snug break-words">
                  {question.order}
                </p>
              </div>
            </div>

            {/* Supply / Available */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-start space-x-3">
              <div className="w-7 h-7 rounded-lg bg-slate-700 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 shadow-xs">
                <Package className="w-4 h-4" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                  Medication On Hand / Supply
                </span>
                <p className="text-sm font-semibold text-slate-800 leading-snug break-words">
                  {question.supply}
                </p>
              </div>
            </div>
          </div>

          {/* Question Prompt */}
          <div className="pt-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {question.prompt}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Select the correct dosage from the choices below.
            </p>
          </div>

          {/* Multiple Choice Options List */}
          <div className="pt-2 space-y-2.5 sm:space-y-3" role="radiogroup" aria-label="Dosage options">
            {question.options.map((option, idx) => {
              const isSelected = userAnswer?.selectedOptionIndex === idx;
              const isOptionCorrect = idx === question.correctIndex;

              // Determine visual styling for Green/Red feedback
              let cardStyle = 'bg-white border-slate-200 text-slate-800 hover:border-sky-400 hover:bg-sky-50/40 cursor-pointer';
              let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-200';
              let statusIcon = null;

              if (isAnswered) {
                if (isSelected) {
                  if (isCorrect) {
                    // Green for correct answer
                    cardStyle = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 shadow-sm ring-2 ring-emerald-500/20';
                    badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
                    statusIcon = <Check className="w-5 h-5 text-emerald-600 stroke-[2.5]" />;
                  } else {
                    // Red for wrong answer
                    cardStyle = 'bg-rose-50 border-2 border-rose-500 text-rose-950 shadow-sm ring-2 ring-rose-500/20';
                    badgeStyle = 'bg-rose-600 text-white border-rose-600';
                    statusIcon = <X className="w-5 h-5 text-rose-600 stroke-[2.5]" />;
                  }
                } else if (isOptionCorrect) {
                  // Show the correct answer in green even if user picked wrong
                  cardStyle = 'bg-emerald-50/60 border-2 border-dashed border-emerald-500 text-emerald-900 font-medium';
                  badgeStyle = 'bg-emerald-500 text-white border-emerald-500';
                  statusIcon = <Check className="w-5 h-5 text-emerald-600 stroke-[2.5]" />;
                } else {
                  // Neutral unselected after answer
                  cardStyle = 'bg-slate-50/60 border-slate-200 text-slate-400 opacity-60 cursor-default';
                  badgeStyle = 'bg-slate-100 text-slate-400 border-slate-200';
                }
              }

              return (
                <button
                  key={idx}
                  id={`question-option-${idx}`}
                  disabled={isAnswered}
                  onClick={() => onSelectOption(idx)}
                  className={`w-full min-h-[52px] p-3.5 sm:p-4 rounded-xl border text-left flex items-center justify-between transition-all duration-150 active:scale-[0.99] ${cardStyle}`}
                  aria-checked={isSelected}
                  role="radio"
                >
                  <div className="flex items-center space-x-3.5 pr-2">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm border flex-shrink-0 transition-colors ${badgeStyle}`}>
                      {optionLetters[idx]}
                    </span>
                    <span className="text-sm sm:text-base font-semibold tracking-tight">
                      {option}
                    </span>
                  </div>

                  {statusIcon && (
                    <div className="flex-shrink-0 pl-2">
                      {statusIcon}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Step-by-Step Rationale & Mathematical Breakdown (unfolds on answer) */}
          {isAnswered && (
            <div 
              id="rationale-section"
              className={`mt-6 rounded-2xl border p-5 sm:p-6 transition-all animate-in fade-in slide-in-from-bottom-3 duration-300 ${
                isCorrect 
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' 
                  : 'bg-rose-50/60 border-rose-200 text-rose-950'
              }`}
            >
              <div className="flex items-center space-x-2.5 pb-3 border-b border-slate-200/60">
                {isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                )}
                <div>
                  <h3 className="font-bold text-sm sm:text-base">
                    {isCorrect ? 'Correct Dosage Calculated!' : 'Incorrect Answer'}
                  </h3>
                  <p className="text-xs text-slate-600">
                    Correct Answer: <strong className="text-emerald-700">{question.options[question.correctIndex]}</strong>
                  </p>
                </div>
              </div>

              {/* Formula & Calculation Steps */}
              <div className="mt-4 space-y-3 text-xs sm:text-sm text-slate-800">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-700">Formula Method:</span>
                  <span className="font-mono font-semibold bg-white/80 px-2 py-0.5 rounded border border-slate-200 text-sky-800">
                    {question.formula}
                  </span>
                </div>

                <div className="bg-white/90 rounded-xl p-3.5 border border-slate-200/80 font-mono text-xs sm:text-sm whitespace-pre-line leading-relaxed text-slate-800">
                  {question.rationale}
                </div>

                {/* Clinical Tip */}
                {question.clinicalTip && (
                  <div className="flex items-start space-x-2.5 bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-amber-900 text-xs">
                    <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">NCLEX & Clinical Safety Pearl: </span>
                      <span>{question.clinicalTip}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Card Footer Navigation */}
        <div className="px-5 py-4 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between gap-3">
          <button
            id="quiz-prev-button"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className={`inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-colors ${
              canGoPrevious
                ? 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700 active:scale-95'
                : 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-50'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            {isAnswered ? (
              <button
                id="quiz-next-button"
                onClick={onNext}
                className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs sm:text-sm font-bold shadow-md shadow-sky-600/20 active:scale-95 transition-all"
              >
                <span>{isLastQuestion ? 'Complete Drill & View Score' : 'Next Question'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs text-slate-400 italic">
                Select an answer to continue
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
