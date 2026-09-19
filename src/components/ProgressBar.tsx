import React from 'react';
import { Check, X } from 'lucide-react';
import { UserAnswer } from '../types';

interface ProgressBarProps {
  currentIndex: number;
  totalQuestions: number;
  userAnswers: Record<number, UserAnswer>;
  questionIds: number[];
  onSelectQuestion: (index: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentIndex,
  totalQuestions,
  userAnswers,
  questionIds,
  onSelectQuestion,
}) => {
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="w-full bg-white border-b border-slate-200/80 px-4 py-3 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-2.5">
        {/* Top bar: Question indicator & percentage */}
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-900 tracking-tight">
              Question <span className="text-sky-600 font-extrabold">{currentIndex + 1}</span> of {totalQuestions}
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500 font-medium">
              {answeredCount} answered
            </span>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
              {progressPercent}% Complete
            </span>
          </div>
        </div>

        {/* Primary continuous progress bar */}
        <div 
          id="quiz-main-progress-bar"
          className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200"
          role="progressbar"
          aria-valuenow={progressPercent}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 50-item interactive micro dot track with horizontal scroll on mobile */}
        <div className="pt-1">
          <div className="flex items-center space-x-1 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {questionIds.map((qId, idx) => {
              const ans = userAnswers[qId];
              const isCurrent = idx === currentIndex;
              const isAnswered = !!ans;
              const isCorrect = ans?.isCorrect;

              let dotClass = 'border-slate-200 bg-white text-slate-400 hover:border-sky-300';
              if (isAnswered) {
                if (isCorrect) {
                  dotClass = 'bg-emerald-500 border-emerald-600 text-white';
                } else {
                  dotClass = 'bg-rose-500 border-rose-600 text-white';
                }
              }

              return (
                <button
                  key={qId}
                  id={`progress-step-${idx + 1}`}
                  onClick={() => onSelectQuestion(idx)}
                  title={`Question ${idx + 1}: ${isAnswered ? (isCorrect ? 'Correct (Green)' : 'Wrong (Red)') : 'Unanswered'}`}
                  className={`flex-shrink-0 w-6 h-6 rounded-md text-[10px] font-bold flex items-center justify-center transition-all border ${dotClass} ${
                    isCurrent ? 'ring-2 ring-sky-500 ring-offset-1 scale-110 font-extrabold z-10' : 'opacity-90 hover:opacity-100'
                  }`}
                >
                  {isAnswered ? (
                    isCorrect ? (
                      <Check className="w-3 h-3 stroke-[3]" />
                    ) : (
                      <X className="w-3 h-3 stroke-[3]" />
                    )
                  ) : (
                    idx + 1
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
