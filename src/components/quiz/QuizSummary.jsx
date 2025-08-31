import React from 'react';
import MCQuestion from './MCQuestion';
import TypingQuestion from './TypingQuestion';
import { checkTypingAnswer } from '../../data/sampleQuestions';

const QuizSummary = ({ questions, userAnswers, onRestartQuiz, onBackToLibrary }) => {
  // Calculate score
  const totalQuestions = questions.length;
  const correctAnswers = questions.reduce((count, question, index) => {
    const userAnswer = userAnswers[index];
    if (!userAnswer) return count;
    
    if (question.type === 'MC') {
      return userAnswer === question.correctAnswer ? count + 1 : count;
    } else if (question.type === 'Typing') {
      return checkTypingAnswer(userAnswer, question.correctAnswer) ? count + 1 : count;
    }
    return count;
  }, 0);

  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  // Get performance message
  const getPerformanceMessage = () => {
    if (scorePercentage >= 90) return { message: "Outstanding! You're a true Spurs expert!", emoji: "🏆", color: "text-yellow-600" };
    if (scorePercentage >= 80) return { message: "Excellent! Your Spurs knowledge is impressive!", emoji: "⭐", color: "text-green-600" };
    if (scorePercentage >= 70) return { message: "Well done! You know your Spurs history!", emoji: "👏", color: "text-blue-600" };
    if (scorePercentage >= 60) return { message: "Good effort! Keep learning about Spurs!", emoji: "👍", color: "text-purple-600" };
    if (scorePercentage >= 50) return { message: "Not bad! There's room to improve your Spurs knowledge.", emoji: "💪", color: "text-orange-600" };
    return { message: "Keep studying! Every Spurs fan can improve their knowledge.", emoji: "📚", color: "text-red-600" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="text-6xl mb-4">{performance.emoji}</div>
        <h1 className="text-3xl font-bold text-gray-900">Quiz Complete!</h1>
        <p className={`text-xl font-semibold ${performance.color}`}>
          {performance.message}
        </p>
      </div>

      {/* Score Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Your Score</h2>
          
          {/* Score Circle */}
          <div className="relative inline-flex items-center justify-center">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              {/* Background circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              {/* Progress circle */}
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="#132257"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${scorePercentage * 3.14} 314`}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-spurs-navy">{scorePercentage}%</div>
                <div className="text-sm text-gray-600">{correctAnswers}/{totalQuestions}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{totalQuestions - correctAnswers}</div>
              <div className="text-sm text-gray-600">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{totalQuestions}</div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Feedback Placeholder */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
        <div className="flex items-start space-x-3">
          <div className="bg-blue-100 rounded-full p-2">
            <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">AI Feedback (Coming Soon)</h3>
            <p className="text-blue-800 text-sm">
              Our AI will soon provide personalized feedback based on your performance, 
              suggesting areas to study and recommending specific topics to improve your Tottenham knowledge.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRestartQuiz}
          className="bg-spurs-navy hover:bg-spurs-blue text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Retake Quiz</span>
        </button>
        <button
          onClick={onBackToLibrary}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          </svg>
          <span>Back to Quiz Library</span>
        </button>
      </div>

      {/* Detailed Results */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Review Your Answers</h2>
        
        {questions.map((question, index) => (
          <div key={question.id} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                Question {index + 1}
              </span>
            </div>
            
            {question.type === 'MC' ? (
              <MCQuestion
                question={question}
                selectedAnswer={userAnswers[index]}
                onAnswerSelect={() => {}} // No-op in results view
                showResults={true}
              />
            ) : (
              <TypingQuestion
                question={question}
                userAnswer={userAnswers[index]}
                onAnswerChange={() => {}} // No-op in results view
                showResults={true}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizSummary;
