import React from 'react';
import { X, Check, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import { Question, UserAnswer } from '../types';

interface QuestionMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  currentIndex: number;
  userAnswers: Record<number, UserAnswer>;
  onSelectQuestion: (index: number) => void;
}

export const QuestionMapModal: React.FC<QuestionMapModalProps> = ({
  isOpen,
  onClose,
  questions,
  currentIndex,
  userAnswers,
  onSelectQuestion,
}) => {
  if (!isOpen) return null;

  const answeredCount = Object.keys(userAnswers).length;
  const correctCount = Object.values(userAnswers).filter(a => a.isCorrect).length;
  const wrongCount = answeredCount - correctCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div 
        id="question-map-modal"
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-sky-900 text-white flex-shrink-0">
          <div>
            <h3 className="font-bold text-base">Question Navigator (50 Questions)</h3>
            <p className="text-xs text-sky-200">Tap any question to jump to it</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-sky-200 hover:text-white rounded-lg hover:bg-sky-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend / Stats */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs flex-shrink-0">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1 font-semibold text-emerald-700">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span>{correctCount} Correct</span>
            </span>
            <span className="flex items-center space-x-1 font-semibold text-rose-700">
              <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
              <span>{wrongCount} Wrong</span>
            </span>
            <span className="flex items-center space-x-1 text-slate-500 font-medium">
              <span className="w-3 h-3 rounded-full bg-slate-200 border border-slate-300 inline-block" />
              <span>{50 - answeredCount} Remaining</span>
            </span>
          </div>
        </div>

        {/* Grid of 50 buttons */}
        <div className="p-5 overflow-y-auto grid grid-cols-5 sm:grid-cols-10 gap-2">
          {questions.map((q, idx) => {
            const ans = userAnswers[q.id];
            const isCurrent = idx === currentIndex;
            const isAnswered = !!ans;
            const isCorrect = ans?.isCorrect;

            let btnClass = 'bg-white text-slate-700 border-slate-200 hover:bg-sky-50 hover:border-sky-300';
            if (isAnswered) {
              if (isCorrect) {
                btnClass = 'bg-emerald-500 border-emerald-600 text-white font-bold shadow-xs';
              } else {
                btnClass = 'bg-rose-500 border-rose-600 text-white font-bold shadow-xs';
              }
            }

            return (
              <button
                key={q.id}
                id={`map-question-btn-${idx + 1}`}
                onClick={() => {
                  onSelectQuestion(idx);
                  onClose();
                }}
                className={`h-11 rounded-xl text-xs flex flex-col items-center justify-center border transition-all active:scale-95 ${btnClass} ${
                  isCurrent ? 'ring-2 ring-sky-500 ring-offset-1 font-extrabold' : ''
                }`}
              >
                <span>{idx + 1}</span>
                {isAnswered && (
                  <span className="text-[9px] mt-0.5">
                    {isCorrect ? '✓' : '✗'}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-right flex-shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Back to Quiz
          </button>
        </div>
      </div>
    </div>
  );
};
