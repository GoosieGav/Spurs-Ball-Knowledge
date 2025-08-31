import React from 'react';

const ProgressBar = ({ currentQuestion, totalQuestions, className = '' }) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Progress text */}
      <div className="flex items-center justify-between text-sm font-medium">
        <span className="text-gray-600">
          Question {currentQuestion + 1} of {totalQuestions}
        </span>
        <span className="text-spurs-navy">
          {Math.round(progress)}% Complete
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-spurs-navy to-spurs-blue h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          <div className="h-full bg-white bg-opacity-20 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      {/* Question dots indicator */}
      <div className="flex justify-center space-x-2 pt-2">
        {Array.from({ length: totalQuestions }, (_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index < currentQuestion + 1
                ? 'bg-spurs-navy scale-110'
                : index === currentQuestion + 1
                ? 'bg-spurs-blue animate-pulse'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProgressBar;
