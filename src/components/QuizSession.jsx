import React, { useState, useEffect } from 'react';
import ProgressBar from './quiz/ProgressBar';
import MCQuestion from './quiz/MCQuestion';
import TypingQuestion from './quiz/TypingQuestion';
import QuizSummary from './quiz/QuizSummary';
import { sampleQuestions } from '../data/sampleQuestions';

const QuizSession = ({ 
  quiz = null, 
  questions = sampleQuestions, // Default to sample questions, but allow prop override for future backend integration
  onExitQuiz,
  onCompleteQuiz 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [startTime, setStartTime] = useState(null);

  // Initialize quiz state
  useEffect(() => {
    setStartTime(new Date());
    setUserAnswers(new Array(questions.length).fill(null));
  }, [questions.length]);

  const currentQuestion = questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // Handle answer selection/input
  const handleAnswerChange = (answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  // Navigation handlers
  const handlePrevious = () => {
    if (!isFirstQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleFinishQuiz = () => {
    const endTime = new Date();
    const timeSpent = Math.round((endTime - startTime) / 1000); // in seconds
    
    setIsQuizComplete(true);
    
    // Call completion callback if provided (for future backend integration)
    if (onCompleteQuiz) {
      onCompleteQuiz({
        quiz,
        questions,
        userAnswers,
        timeSpent,
        completedAt: endTime
      });
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers(new Array(questions.length).fill(null));
    setIsQuizComplete(false);
    setStartTime(new Date());
  };

  const handleBackToLibrary = () => {
    if (onExitQuiz) {
      onExitQuiz();
    }
  };

  // Show quiz summary if complete
  if (isQuizComplete) {
    return (
      <QuizSummary
        questions={questions}
        userAnswers={userAnswers}
        onRestartQuiz={handleRestartQuiz}
        onBackToLibrary={handleBackToLibrary}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img 
                src="/spurs-logo.png" 
                alt="Tottenham Hotspur Logo" 
                className="w-8 h-8 object-contain"
                loading="lazy"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {quiz ? quiz.title : 'Spurs Trivia Quiz'}
                </h1>
                <p className="text-gray-600 text-sm">
                  {quiz ? quiz.description : 'Test your knowledge of Tottenham Hotspur'}
                </p>
              </div>
            </div>
            <button
              onClick={handleBackToLibrary}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2"
              title="Exit Quiz"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <ProgressBar 
            currentQuestion={currentQuestionIndex}
            totalQuestions={questions.length}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          {/* Question Type Badge */}
          <div className="mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              currentQuestion.type === 'MC' 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {currentQuestion.type === 'MC' ? 'Multiple Choice' : 'Type Your Answer'}
            </span>
          </div>

          {/* Question Component */}
          {currentQuestion.type === 'MC' ? (
            <MCQuestion
              question={currentQuestion}
              selectedAnswer={userAnswers[currentQuestionIndex]}
              onAnswerSelect={handleAnswerChange}
            />
          ) : (
            <TypingQuestion
              question={currentQuestion}
              userAnswer={userAnswers[currentQuestionIndex]}
              onAnswerChange={handleAnswerChange}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={isFirstQuestion}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                isFirstQuestion
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>

            {/* Question indicator */}
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <span>Question</span>
              <span className="font-semibold text-spurs-navy">
                {currentQuestionIndex + 1}
              </span>
              <span>of</span>
              <span className="font-semibold">
                {questions.length}
              </span>
            </div>

            {isLastQuestion ? (
              <button
                onClick={handleFinishQuiz}
                className="flex items-center space-x-2 bg-spurs-navy hover:bg-spurs-blue text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
              >
                <span>Finish Quiz</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 bg-spurs-navy hover:bg-spurs-blue text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
              >
                <span>Next</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Answer Summary (optional - shows progress) */}
        <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Progress Overview</h3>
          <div className="grid grid-cols-8 sm:grid-cols-12 gap-2">
            {questions.map((_, index) => (
              <div
                key={index}
                className={`aspect-square rounded-md border-2 transition-all duration-200 flex items-center justify-center text-xs font-medium ${
                  index === currentQuestionIndex
                    ? 'border-spurs-navy bg-spurs-navy text-white'
                    : userAnswers[index] !== null
                    ? 'border-green-300 bg-green-100 text-green-800'
                    : 'border-gray-300 bg-gray-50 text-gray-400'
                }`}
                title={`Question ${index + 1}${userAnswers[index] !== null ? ' - Answered' : ' - Not answered'}`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizSession;
