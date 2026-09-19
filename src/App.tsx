import React, { useState, useMemo } from 'react';
import { QUESTIONS } from './data/questions';
import { Question, UserAnswer } from './types';
import { Header } from './components/Header';
import { ProgressBar } from './components/ProgressBar';
import { QuestionCard } from './components/QuestionCard';
import { QuizSummary } from './components/QuizSummary';
import { CalculatorModal } from './components/CalculatorModal';
import { QuestionMapModal } from './components/QuestionMapModal';

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function App() {
  const [questions, setQuestions] = useState<Question[]>(() => QUESTIONS);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, UserAnswer>>({});
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  const [showCalculator, setShowCalculator] = useState<boolean>(false);
  const [showQuestionMap, setShowQuestionMap] = useState<boolean>(false);

  const currentQuestion = questions[currentIndex] || questions[0];
  const currentAnswer = userAnswers[currentQuestion?.id];

  const answeredCount = Object.keys(userAnswers).length;
  const score = useMemo(() => {
    return Object.values(userAnswers).filter(a => a.isCorrect).length;
  }, [userAnswers]);

  const questionIds = useMemo(() => questions.map(q => q.id), [questions]);

  // Handle selecting multiple choice option
  const handleSelectOption = (optionIndex: number) => {
    if (!currentQuestion) return;
    // Prevent overriding already submitted answer for this question
    if (userAnswers[currentQuestion.id]) return;

    const isCorrect = optionIndex === currentQuestion.correctIndex;
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOptionIndex: optionIndex,
      isCorrect,
    };

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: newAnswer,
    }));
  };

  // Move to next question or show end screen
  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsCompleted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Move to previous question
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Jump to specific question
  const handleSelectQuestionIndex = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
      setIsCompleted(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Toggle shuffle questions
  const handleToggleShuffle = () => {
    const shouldShuffle = !isShuffled;
    setIsShuffled(shouldShuffle);
    if (shouldShuffle) {
      setQuestions(shuffleArray(QUESTIONS));
    } else {
      setQuestions(QUESTIONS);
    }
    setCurrentIndex(0);
    setUserAnswers({});
    setIsCompleted(false);
  };

  // Restart quiz
  const handleRestart = (shuffle: boolean) => {
    setIsShuffled(shuffle);
    if (shuffle) {
      setQuestions(shuffleArray(QUESTIONS));
    } else {
      setQuestions(QUESTIONS);
    }
    setCurrentIndex(0);
    setUserAnswers({});
    setIsCompleted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Retake missed questions
  const handleRetakeMissed = (missed: Question[]) => {
    setQuestions(missed);
    setCurrentIndex(0);
    setUserAnswers({});
    setIsCompleted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        score={score}
        answeredCount={answeredCount}
        isShuffled={isShuffled}
        onToggleShuffle={handleToggleShuffle}
        onOpenCalculator={() => setShowCalculator(true)}
        onOpenQuestionMap={() => setShowQuestionMap(true)}
      />

      {/* Persistent Progress Bar (during quiz) */}
      {!isCompleted && (
        <ProgressBar
          currentIndex={currentIndex}
          totalQuestions={questions.length}
          userAnswers={userAnswers}
          questionIds={questionIds}
          onSelectQuestion={handleSelectQuestionIndex}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {!isCompleted ? (
          <QuestionCard
            key={currentQuestion.id}
            question={currentQuestion}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            userAnswer={currentAnswer}
            onSelectOption={handleSelectOption}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onOpenCalculator={() => setShowCalculator(true)}
            canGoPrevious={currentIndex > 0}
            isLastQuestion={currentIndex === questions.length - 1}
          />
        ) : (
          <QuizSummary
            questions={questions}
            userAnswers={userAnswers}
            onRestart={handleRestart}
            onRetakeMissed={handleRetakeMissed}
          />
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="py-4 border-t border-slate-200/80 bg-white text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>RN Dose Drill • Nursing Dosage Calculation Quiz</span>
          <span>Green = Correct • Red = Wrong • 50 Clinical Math Questions</span>
        </div>
      </footer>

      {/* Clinical Calculator Modal */}
      <CalculatorModal
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
      />

      {/* Question Map Overview Modal */}
      <QuestionMapModal
        isOpen={showQuestionMap}
        onClose={() => setShowQuestionMap(false)}
        questions={questions}
        currentIndex={currentIndex}
        userAnswers={userAnswers}
        onSelectQuestion={handleSelectQuestionIndex}
      />
    </div>
  );
}
