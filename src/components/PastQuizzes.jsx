import React, { useState } from 'react';
import { pastQuizAttempts, calculateOverallStats, getScoreColor, formatDate } from '../data/pastQuizzes';

const PastQuizzes = ({ onBackToLibrary }) => {
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  
  const stats = calculateOverallStats(pastQuizAttempts);

  const toggleExpand = (quizId) => {
    setExpandedQuiz(expandedQuiz === quizId ? null : quizId);
  };

  const getPerformanceIcon = (percent) => {
    if (percent >= 80) return '🏆';
    if (percent >= 50) return '👍';
    return '📚';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-spurs-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBackToLibrary}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-medium">Back to Quiz Library</span>
              </button>
              <img 
                src="/spurs-logo.png" 
                alt="Tottenham Hotspur Logo" 
                className="w-8 h-8 md:w-10 md:h-10 object-contain filter brightness-0 invert"
                loading="lazy"
              />
              <div>
                <h1 className="text-2xl font-bold">Past Quizzes</h1>
                <p className="text-spurs-white opacity-90">Your quiz history and progress</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6 text-sm">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {stats.totalQuizzes} Quizzes Completed
              </span>
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                {stats.averageScore}% Average
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Stats */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Quiz Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Average Score */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
              <div className="text-4xl mb-4">📊</div>
              <div className="text-3xl font-bold text-spurs-navy mb-2">{stats.averageScore}%</div>
              <div className="text-gray-600 font-medium">Average Score</div>
              <div className="text-sm text-gray-500 mt-2">
                Across {stats.totalQuizzes} quiz{stats.totalQuizzes !== 1 ? 'es' : ''}
              </div>
            </div>

            {/* Best Score */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
              <div className="text-4xl mb-4">🏆</div>
              <div className="text-3xl font-bold text-green-600 mb-2">{stats.bestScore}%</div>
              <div className="text-gray-600 font-medium">Best Score</div>
              <div className="text-sm text-gray-500 mt-2">
                Your highest achievement
              </div>
            </div>

            {/* Total Quizzes */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-gray-200">
              <div className="text-4xl mb-4">🎯</div>
              <div className="text-3xl font-bold text-purple-600 mb-2">{stats.totalQuizzes}</div>
              <div className="text-gray-600 font-medium">Quizzes Taken</div>
              <div className="text-sm text-gray-500 mt-2">
                Keep up the learning!
              </div>
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Performance Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {pastQuizAttempts.filter(quiz => quiz.percent >= 80).length}
              </div>
              <div className="text-sm text-gray-600">Excellent (&ge;80%)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">
                {pastQuizAttempts.filter(quiz => quiz.percent >= 50 && quiz.percent < 80).length}
              </div>
              <div className="text-sm text-gray-600">Good (50-79%)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {pastQuizAttempts.filter(quiz => quiz.percent < 50).length}
              </div>
              <div className="text-sm text-gray-600">Needs Practice (&lt;50%)</div>
            </div>
          </div>
        </div>

        {/* Quiz History */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Quiz History</h2>
          
          <div className="space-y-4">
            {pastQuizAttempts.map((attempt) => (
              <div key={attempt.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Quiz Summary Card */}
                <div 
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => toggleExpand(attempt.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="text-2xl">{getPerformanceIcon(attempt.percent)}</div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{attempt.quizName}</h3>
                          <p className="text-sm text-gray-500">{formatDate(attempt.date)}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      {/* Score */}
                      <div className="text-center">
                        <div className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(attempt.percent)}`}>
                          {attempt.percent}%
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {attempt.score.correct}/{attempt.score.total}
                        </div>
                      </div>
                      
                      {/* Time */}
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-700">{attempt.time}</div>
                        <div className="text-xs text-gray-500">time taken</div>
                      </div>
                      
                      {/* Expand Arrow */}
                      <div className="flex items-center">
                        <svg 
                          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                            expandedQuiz === attempt.id ? 'rotate-180' : ''
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedQuiz === attempt.id && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    <div className="p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Question Breakdown</h4>
                      
                      <div className="space-y-4">
                        {attempt.details.map((detail, index) => (
                          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
                            <div className="flex items-start space-x-3">
                              {/* Question Number and Status */}
                              <div className="flex-shrink-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                  detail.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}>
                                  {index + 1}
                                </div>
                              </div>
                              
                              {/* Question Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-3">
                                  <h5 className="text-sm font-medium text-gray-900 leading-relaxed">
                                    {detail.question}
                                  </h5>
                                  <div className="flex-shrink-0 ml-4">
                                    {detail.isCorrect ? (
                                      <div className="flex items-center text-green-600">
                                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium">Correct</span>
                                      </div>
                                    ) : (
                                      <div className="flex items-center text-red-600">
                                        <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm font-medium">Incorrect</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  {/* User Answer */}
                                  <div>
                                    <span className="font-medium text-gray-700">Your Answer:</span>
                                    <div className={`mt-1 p-2 rounded ${
                                      detail.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                                    }`}>
                                      {detail.userAnswer || 'No answer provided'}
                                    </div>
                                  </div>
                                  
                                  {/* Correct Answer */}
                                  <div>
                                    <span className="font-medium text-gray-700">Correct Answer:</span>
                                    <div className="mt-1 p-2 bg-green-50 text-green-800 rounded">
                                      {detail.correctAnswer}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Ready for Another Challenge?
            </h3>
            <p className="text-gray-600 mb-6">
              Keep improving your Spurs knowledge with more quizzes!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onBackToLibrary}
                className="bg-spurs-navy hover:bg-spurs-blue text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                Take Another Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastQuizzes;
