import React from 'react';

const QuizCard = ({ quiz, onStartQuiz }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'badge-difficulty-easy';
      case 'medium':
        return 'badge-difficulty-medium';
      case 'hard':
        return 'badge-difficulty-hard';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'speed':
        return 'bg-red-500 text-white';
      case 'multiple choice':
        return 'bg-blue-500 text-white';
      case 'typing':
        return 'bg-green-500 text-white';
      case 'mixed':
        return 'bg-purple-500 text-white';
      default:
        return 'badge-type';
    }
  };

  return (
    <div className="quiz-card group overflow-hidden">
      {/* Image Header */}
      {quiz.imageUrl && (
        <div className="relative h-48 overflow-hidden rounded-t-lg mb-4">
          <img 
            src={quiz.imageUrl}
            alt={quiz.imageAlt || quiz.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Overlay with thumbnail emoji */}
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <span className="text-2xl">{quiz.thumbnail}</span>
          </div>
          {/* Speed quiz indicator */}
          {quiz.isSpeedQuiz && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <span className="mr-1">⚡</span>
              Speed Quiz
            </div>
          )}
        </div>
      )}

      {/* Fallback header when no image */}
      {!quiz.imageUrl && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{quiz.thumbnail}</div>
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-spurs-navy transition-colors">
                {quiz.title}
              </h3>
              {quiz.isSpeedQuiz && (
                <span className="inline-flex items-center text-xs text-red-600 font-medium">
                  <span className="mr-1">⚡</span>
                  Speed Quiz
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Container */}
      <div className={quiz.imageUrl ? "quiz-card-content" : ""}>
        {/* Title (when image is present) */}
        {quiz.imageUrl && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-spurs-navy transition-colors">
              {quiz.title}
            </h3>
          </div>
        )}

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {quiz.description}
        </p>

        {/* Categories */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {quiz.categories.map((category, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-spurs-blue text-white"
              >
                {category}
              </span>
            ))}
          </div>
        </div>

        {/* Badges and info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className={`badge ${getDifficultyColor(quiz.difficulty)}`}>
              {quiz.difficulty}
            </span>
            <span className={`badge ${getTypeColor(quiz.type)}`}>
              {quiz.type}
            </span>
          </div>
          <div className="text-sm text-gray-500">
            {quiz.questionCount} questions
          </div>
        </div>

        {/* Footer with time and start button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-500">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {quiz.estimatedTime}
          </div>
          <button
            onClick={() => onStartQuiz(quiz)}
            className="bg-spurs-navy hover:bg-spurs-blue text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
          >
            <span>Start Quiz</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
