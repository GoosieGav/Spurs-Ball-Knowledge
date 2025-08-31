import React from 'react';
import { checkTypingAnswer } from '../../data/sampleQuestions';

const TypingQuestion = ({ question, userAnswer, onAnswerChange, showResults = false }) => {
  const isCorrect = showResults ? checkTypingAnswer(userAnswer || '', question.correctAnswer) : null;

  const getInputStyle = () => {
    if (!showResults) {
      return 'border-gray-300 focus:border-spurs-navy focus:ring-spurs-navy';
    } else {
      return isCorrect 
        ? 'border-green-300 bg-green-50 text-green-800'
        : 'border-red-300 bg-red-50 text-red-800';
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 leading-relaxed">
        {question.text}
      </h2>
      
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={userAnswer || ''}
            onChange={(e) => !showResults && onAnswerChange(e.target.value)}
            disabled={showResults}
            placeholder={showResults ? '' : "Type your answer here..."}
            className={`w-full p-4 border-2 rounded-lg text-lg font-medium transition-all duration-200 ${getInputStyle()} ${
              showResults ? 'cursor-default' : ''
            }`}
          />
          
          {/* Show result indicator */}
          {showResults && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              {isCorrect ? (
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          )}
        </div>

        {/* Typing hints */}
        {!showResults && (
          <div className="text-sm text-gray-500 flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <span>Spelling and capitalization don't need to be perfect</span>
          </div>
        )}

        {/* Show correct answer and result in results view */}
        {showResults && (
          <div className="space-y-4">
            {!isCorrect && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">Correct Answer</h4>
                    <p className="text-yellow-800 font-semibold">{question.correctAnswer}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Explanation */}
            {question.explanation && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">Explanation</h4>
                    <p className="text-blue-800 text-sm leading-relaxed">{question.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TypingQuestion;
