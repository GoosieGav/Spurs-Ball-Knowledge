import React, { useState, useMemo } from 'react';
import Home from './components/Home';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import QuizList from './components/QuizList';
import QuizSession from './components/QuizSession';
import PastQuizzes from './components/PastQuizzes';
import { sampleQuizzes } from './data/quizzes';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'library', 'quiz', or 'pastQuizzes'
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    categories: [],
    difficulty: '',
    type: '',
    speedOnly: false
  });

  // Filter and search logic
  const filteredQuizzes = useMemo(() => {
    let filtered = sampleQuizzes;

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(quiz =>
        quiz.title.toLowerCase().includes(searchLower) ||
        quiz.description.toLowerCase().includes(searchLower) ||
        quiz.categories.some(cat => cat.toLowerCase().includes(searchLower))
      );
    }

    // Apply category filter
    if (filters.categories.length > 0) {
      filtered = filtered.filter(quiz =>
        quiz.categories.some(cat => filters.categories.includes(cat))
      );
    }

    // Apply difficulty filter
    if (filters.difficulty) {
      filtered = filtered.filter(quiz => quiz.difficulty === filters.difficulty);
    }

    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(quiz => quiz.type === filters.type);
    }

    // Apply speed quiz filter
    if (filters.speedOnly) {
      filtered = filtered.filter(quiz => quiz.isSpeedQuiz);
    }

    return filtered;
  }, [searchTerm, filters]);

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentView('quiz');
  };

  const handleExitQuiz = () => {
    setCurrentView('library');
    setActiveQuiz(null);
  };

  const handleCompleteQuiz = (quizData) => {
    // Handle quiz completion - could save to backend in the future
    console.log('Quiz completed:', quizData);
  };

  const handleSearchChange = (value) => {
    setSearchTerm(value);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleViewPastQuizzes = () => {
    setCurrentView('pastQuizzes');
  };

  const handleBackToLibrary = () => {
    setCurrentView('library');
  };

  const handleGoHome = () => {
    setCurrentView('home');
  };

  const handleGoToLibrary = () => {
    setCurrentView('library');
  };

  // Show quiz session if in quiz mode
  if (currentView === 'quiz') {
    return (
      <QuizSession
        quiz={activeQuiz}
        onExitQuiz={handleExitQuiz}
        onCompleteQuiz={handleCompleteQuiz}
      />
    );
  }

  // Show past quizzes if in past quizzes mode
  if (currentView === 'pastQuizzes') {
    return (
      <PastQuizzes onBackToLibrary={handleBackToLibrary} />
    );
  }

  // Show home page if in home mode
  if (currentView === 'home') {
    return (
      <div>
        {/* Simplified Header for Home */}
        <header className="bg-spurs-navy text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src="/spurs-logo.png" 
                  alt="Tottenham Hotspur Logo" 
                  className="w-8 h-8 md:w-10 md:h-10 object-contain filter brightness-0 invert"
                  loading="lazy"
                />
                <div>
                  <h1 className="text-2xl font-bold">Spurs Trivia</h1>
                  <p className="text-spurs-white opacity-90">Come On You Spurs!</p>
                </div>
              </div>
              <div className="flex items-center space-x-6">
                <button
                  onClick={handleGoToLibrary}
                  className="text-white hover:text-spurs-gold font-medium transition-colors duration-200"
                >
                  Quiz Library
                </button>
                <button
                  onClick={handleViewPastQuizzes}
                  className="text-white hover:text-spurs-gold font-medium transition-colors duration-200"
                >
                  Past Quizzes
                </button>
              </div>
            </div>
          </div>
        </header>
        <Home 
          onStartQuiz={handleGoToLibrary} 
          onViewPastQuizzes={handleViewPastQuizzes} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-spurs-navy text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/spurs-logo.png" 
                alt="Tottenham Hotspur Logo" 
                className="w-8 h-8 md:w-10 md:h-10 object-contain filter brightness-0 invert"
                loading="lazy"
              />
              <div>
                <h1 className="text-2xl font-bold">Spurs Trivia</h1>
                <p className="text-spurs-white opacity-90">Come On You Spurs!</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={handleGoHome}
                className="text-white hover:text-spurs-gold font-medium transition-colors duration-200"
              >
                Home
              </button>
              <button
                onClick={handleViewPastQuizzes}
                className="text-white hover:text-spurs-gold font-medium transition-colors duration-200"
              >
                Past Quizzes
              </button>
            </div>
            
            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-4">
              <button
                onClick={handleGoHome}
                className="text-white hover:text-spurs-gold p-2 transition-colors duration-200"
                title="Home"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-9 9a1 1 0 001.414 1.414L2 12.414V17a1 1 0 001 1h3a1 1 0 001-1v-3a1 1 0 011-1h2a1 1 0 011 1v3a1 1 0 001 1h3a1 1 0 001-1v-4.586l.293.293a1 1 0 001.414-1.414l-9-9z" />
                </svg>
              </button>
              <button
                onClick={handleViewPastQuizzes}
                className="text-white hover:text-spurs-gold p-2 transition-colors duration-200"
                title="Past Quizzes"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12a1 1 0 01-1-1V6.414l-1.293 1.293a1 1 0 11-1.414-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L10 6.414V11a1 1 0 01-1 1z" />
                  <path d="M4 14a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* Search Section */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Test Your Tottenham Knowledge
            </h2>
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
              placeholder="Search quizzes by title, description, or category..."
            />
          </div>
        </div>

        {/* Filters */}
        <FilterPanel
          filters={filters}
          onFiltersChange={handleFiltersChange}
        />

        {/* Results Summary */}
        {(searchTerm || filters.categories.length > 0 || filters.difficulty || filters.type || filters.speedOnly) && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-blue-900">
                  {filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 ? 'es' : ''} found
                </span>
              </div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilters({ categories: [], difficulty: '', type: '', speedOnly: false });
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}

        {/* Quiz List */}
        <QuizList
          quizzes={filteredQuizzes}
          onStartQuiz={handleStartQuiz}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Made with ❤️ for Tottenham Hotspur fans everywhere
            </p>
            <p className="text-gray-500 text-xs mt-2">
              COYS! 🐓⚽
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
