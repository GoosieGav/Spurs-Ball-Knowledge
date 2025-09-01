import React from 'react';

const Home = ({ onStartQuiz, onViewPastQuizzes, onShowLogin, quizzes = [], quizzesLoading = false }) => {
  // Get featured quizzes (all available quizzes, max 3)
  const featuredQuizzes = quizzes.slice(0, 3);
  
  // Get speed quizzes count
  const speedQuizzes = quizzes.filter(quiz => quiz.isSpeedQuiz || quiz.type === 'Speed');

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <div className="relative overflow-hidden min-h-screen">
        {/* Stadium Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
          style={{
            backgroundImage: 'url(/stadium-background.png)',
          }}
        >
          {/* Preload hint for better performance */}
          <link rel="preload" as="image" href="/stadium-background.png" />
        </div>
        
        {/* Dark Overlay for Readability */}
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        
        {/* Additional Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-spurs-navy/30 via-transparent to-spurs-navy/60" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Main Logo/Icon */}
            <div className="flex justify-center mb-8">
              <div className="bg-white rounded-full p-4 shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="/spurs-logo.png" 
                  alt="Tottenham Hotspur Logo" 
                  className="w-32 h-32 md:w-40 md:h-40 object-contain filter drop-shadow-sm"
                  loading="eager"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div className="text-6xl md:text-7xl hidden">🐓</div>
              </div>
            </div>

            {/* Welcome Message */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Welcome to
              <span className="block text-spurs-gold">Spurs Trivia</span>
            </h1>
            <p className="text-xl md:text-2xl text-white opacity-90 mb-4 max-w-3xl mx-auto">
              Test Your Tottenham Knowledge!
            </p>
            <p className="text-lg text-white opacity-80 mb-12 max-w-2xl mx-auto leading-relaxed">
              From the glory of White Hart Lane to modern-day heroes, challenge yourself with questions 
              about the club we all love. Ready to prove you're a true Spurs fan?
            </p>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <button
                onClick={onStartQuiz}
                className="bg-spurs-gold hover:bg-yellow-500 text-spurs-navy px-10 py-4 rounded-lg font-bold text-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center space-x-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                <span>Start Quiz</span>
              </button>
              
              <button
                onClick={onViewPastQuizzes}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white border-2 border-white border-opacity-50 px-10 py-4 rounded-lg font-bold text-xl transition-all duration-200 backdrop-blur-sm flex items-center justify-center space-x-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12a1 1 0 01-1-1V6.414l-1.293 1.293a1 1 0 11-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L10 6.414V11a1 1 0 01-1 1z" />
                  <path d="M4 14a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" />
                </svg>
                <span>View Past Quizzes</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-spurs-navy mb-4">Join the Community</h2>
            <p className="text-gray-600 text-lg">Test your knowledge alongside fellow Spurs fans</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-spurs-navy text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl">
                📚
              </div>
              <div className="text-3xl font-bold text-spurs-navy">{quizzes.length}</div>
              <div className="text-gray-600">Total Quizzes</div>
            </div>
            
            <div className="text-center">
              <div className="bg-red-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl">
                ⚡
              </div>
              <div className="text-3xl font-bold text-spurs-navy">{speedQuizzes.length}</div>
              <div className="text-gray-600">Speed Challenges</div>
            </div>
            
            <div className="text-center">
              <div className="bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl">
                🏆
              </div>
              <div className="text-3xl font-bold text-spurs-navy">∞</div>
              <div className="text-gray-600">Learning Opportunities</div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Quizzes Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Quizzes</h2>
            <p className="text-gray-600 text-lg">Start with these popular challenges</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
            {quizzesLoading ? (
              // Loading state
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-6 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded mb-4"></div>
                    <div className="flex justify-between items-center">
                      <div className="flex space-x-2">
                        <div className="h-6 w-12 bg-gray-300 rounded"></div>
                        <div className="h-6 w-16 bg-gray-300 rounded"></div>
                      </div>
                      <div className="h-8 w-16 bg-gray-300 rounded"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : featuredQuizzes.length === 0 ? (
              // Empty state
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">🤔</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes available yet</h3>
                <p className="text-gray-600">Check back soon for new Spurs trivia challenges!</p>
              </div>
            ) : (
              // Quiz cards
              featuredQuizzes.map((quiz, index) => (
              <div key={quiz.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                {/* Quiz Image */}
                {quiz.imageUrl && (
                  <div className="relative h-48 overflow-hidden">
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
                    {/* Categories overlay */}
                    <div className="absolute top-3 left-3 flex space-x-1">
                      {quiz.categories.slice(0, 2).map((category, catIndex) => (
                        <span key={catIndex} className="bg-spurs-blue/90 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Fallback for quizzes without images */}
                {!quiz.imageUrl && (
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="text-3xl">{quiz.thumbnail}</div>
                      <div className="flex space-x-1">
                        {quiz.categories.slice(0, 2).map((category, catIndex) => (
                          <span key={catIndex} className="bg-spurs-blue text-white px-2 py-1 rounded text-xs">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-spurs-navy transition-colors">
                    {quiz.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {quiz.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                        quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {quiz.difficulty}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {quiz.questionCount}
                      </span>
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {quiz.estimatedTime}
                      </span>
                    </div>
                    
                    <button 
                      onClick={() => onStartQuiz(quiz)}
                      className="bg-spurs-navy hover:bg-spurs-blue text-white px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 flex items-center space-x-2"
                    >
                      <span>Start</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              ))
            )}
          </div>
          
          {!quizzesLoading && featuredQuizzes.length > 0 && (
            <div className="text-center mt-12">
              <button
                onClick={onStartQuiz}
                className="bg-spurs-navy hover:bg-spurs-blue text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center space-x-2"
              >
                <span>View All Quizzes</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-spurs-navy text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-4xl mb-4">🐓⚽</div>
          <h3 className="text-2xl font-bold mb-4">Come On You Spurs!</h3>
          <p className="text-spurs-white opacity-80 text-lg">
            "It is better to fail aiming high than to succeed aiming low. And we of Spurs have set our sights very high, so high in fact that even failure will have in it an echo of glory."
          </p>
          <p className="text-spurs-white opacity-60 text-sm mt-4">
            - Bill Nicholson
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;

