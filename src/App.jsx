import React, { useState, useMemo, useEffect } from 'react';
import Home from './components/Home';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import QuizList from './components/QuizList';
import QuizSession from './components/QuizSession';
import PastQuizzes from './components/PastQuizzes';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ProfileSettings from './components/ProfileSettings';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useQuizzes } from './hooks/useQuizzes';
import { useQuestions } from './hooks/useQuestions';
import { supabase } from './lib/supabase';

function AppContent() {
  const { user, loading } = useAuth();
  const { quizzes, loading: quizzesLoading, error: quizzesError } = useQuizzes();
  const [currentView, setCurrentView] = useState('home'); // 'home', 'library', 'quiz', or 'pastQuizzes'
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLogin, setShowLogin] = useState(!user); // Show login by default if not authenticated
  const [showSignUp, setShowSignUp] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  // Debug function to track profile settings state
  const handleOpenProfileSettings = () => {
    console.log('🚀 Opening Profile Settings modal...');
    setShowProfileSettings(true);
  };
  const [filters, setFilters] = useState({
    categories: [],
    difficulty: '',
    type: '',
    speedOnly: false
  });

  // Filter and search logic - MUST be before any conditional returns
  const filteredQuizzes = useMemo(() => {
    let filtered = quizzes;

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
  }, [quizzes, searchTerm, filters]);

  // Handle authentication state changes
  useEffect(() => {
    if (user) {
      setShowLogin(false); // Hide login when user is authenticated
    } else {
      setShowLogin(true); // Show login when user is not authenticated
    }
  }, [user]);

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentView('quiz');
  };

  const handleExitQuiz = () => {
    setCurrentView('library');
    setActiveQuiz(null);
  };

  const handleCompleteQuiz = async (quizData) => {
    // Save quiz attempt to database
    try {
      if (!user) {
        console.log('No user logged in, cannot save quiz attempt');
        return;
      }

      const { quiz, questions, userAnswers, timeSpent, completedAt } = quizData;
      
      // Calculate score
      let correctAnswers = 0;
      const detailedAnswers = questions.map((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        if (isCorrect) correctAnswers++;
        
        return {
          question: question.text,
          userAnswer: userAnswer || 'No answer provided',
          correctAnswer: question.correctAnswer,
          isCorrect
        };
      });

      const percentage = Math.round((correctAnswers / questions.length) * 100);

      // Save to database
      const { error } = await supabase
        .from('quiz_attempts')
        .insert({
          user_id: user.id,
          quiz_id: quiz.id,
          quiz_name: quiz.title,
          score: correctAnswers,
          total_questions: questions.length,
          percentage: percentage,
          time_taken: timeSpent,
          answers: detailedAnswers,
          completed_at: completedAt.toISOString()
        });

      if (error) {
        console.error('Error saving quiz attempt:', error);
      } else {
        console.log('Quiz attempt saved successfully');
      }
    } catch (err) {
      console.error('Error saving quiz attempt:', err);
    }
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

  // Show loading spinner while checking auth or loading quizzes - AFTER all hooks
  if (loading || quizzesLoading) {
    return (
      <div className="min-h-screen bg-spurs-navy flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-spurs-gold mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading your Spurs experience...</p>
          {quizzesError && (
            <p className="text-red-300 text-sm mt-2">
              Error loading quizzes: {quizzesError}
            </p>
          )}
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return (
      <>
        {showLogin && (
          <Login
            onClose={() => setShowLogin(false)}
            onSwitchToSignUp={() => {
              setShowLogin(false);
              setShowSignUp(true);
            }}
          />
        )}

        {showSignUp && (
          <SignUp
            onClose={() => setShowSignUp(false)}
            onSwitchToLogin={() => {
              setShowSignUp(false);
              setShowLogin(true);
            }}
          />
        )}

        {/* Fallback background if modals are closed */}
        {!showLogin && !showSignUp && (
          <div className="min-h-screen bg-spurs-navy flex items-center justify-center">
            <div className="text-center">
              <div className="flex justify-center mb-8">
                <div className="bg-white rounded-full p-4 shadow-2xl">
                  <img 
                    src="/spurs-logo.png" 
                    alt="Tottenham Hotspur Logo" 
                    className="w-32 h-32 object-contain"
                    loading="eager"
                  />
                </div>
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">Welcome to Spurs Trivia</h1>
              <p className="text-white opacity-80 mb-8">Please sign in to continue</p>
              <button
                onClick={() => setShowLogin(true)}
                className="bg-spurs-gold hover:bg-yellow-500 text-spurs-navy px-8 py-3 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  // Show quiz session if in quiz mode
  if (currentView === 'quiz') {
    return (
      <QuizSessionWrapper
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

    // Render the main content based on current view
  const renderMainContent = () => {
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
                  {user ? (
                    <UserMenu onOpenSettings={handleOpenProfileSettings} />
                  ) : (
                    <button
                      onClick={() => setShowLogin(true)}
                      className="bg-spurs-gold hover:bg-yellow-500 text-spurs-navy px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          </header>
          <Home
            onStartQuiz={handleGoToLibrary}
            onViewPastQuizzes={handleViewPastQuizzes}
            onShowLogin={() => setShowLogin(true)}
            quizzes={quizzes}
            quizzesLoading={quizzesLoading}
          />
        </div>
      );
    }

    // Default view - Quiz Library
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
              {user ? (
                <UserMenu onOpenSettings={handleOpenProfileSettings} />
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className="bg-spurs-gold hover:bg-yellow-500 text-spurs-navy px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Login
                </button>
              )}
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

      {/* Debug Button (remove after testing) */}
      {user && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
          <button
            onClick={handleOpenProfileSettings}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg"
          >
            🐛 Test Profile Settings
          </button>
        </div>
      )}

      {/* Profile Settings Modal */}
      {showProfileSettings && (
        <ProfileSettings
          onClose={() => {
            console.log('🔄 Closing Profile Settings modal...');
            setShowProfileSettings(false);
          }}
        />
      )}

    </div>
    );
  };

  // Main render with modals that are available from all views
  return (
    <>
      {renderMainContent()}
      
      {/* Debug Button (remove after testing) */}
      {user && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
          <button
            onClick={handleOpenProfileSettings}
            className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg"
          >
            🐛 Test Profile Settings
          </button>
        </div>
      )}

      {/* Profile Settings Modal - Available from all views */}
      {showProfileSettings && (
        <ProfileSettings
          onClose={() => {
            console.log('🔄 Closing Profile Settings modal...');
            setShowProfileSettings(false);
          }}
        />
      )}
    </>
  );
}

// QuizSessionWrapper component that fetches questions for a quiz
function QuizSessionWrapper({ quiz, onExitQuiz, onCompleteQuiz }) {
  const { questions, loading: questionsLoading, error: questionsError } = useQuestions(quiz?.id);

  if (questionsLoading) {
    return (
      <div className="min-h-screen bg-spurs-navy flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-spurs-gold mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😔</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load quiz</h3>
          <p className="text-gray-600 mb-4">Error: {questionsError}</p>
          <button
            onClick={onExitQuiz}
            className="bg-spurs-navy hover:bg-spurs-blue text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📝</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No questions available</h3>
          <p className="text-gray-600 mb-4">This quiz doesn't have any questions yet.</p>
          <button
            onClick={onExitQuiz}
            className="bg-spurs-navy hover:bg-spurs-blue text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
          >
            Back to Library
          </button>
        </div>
      </div>
    );
  }

  return (
    <QuizSession
      quiz={quiz}
      questions={questions}
      onExitQuiz={onExitQuiz}
      onCompleteQuiz={onCompleteQuiz}
    />
  );
}

// UserMenu component for authenticated users
function UserMenu({ onOpenSettings }) {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  const handleOpenSettings = () => {
    console.log('🎯 Profile Settings clicked!', { onOpenSettings: !!onOpenSettings });
    setIsOpen(false);
    if (onOpenSettings) {
      onOpenSettings();
    } else {
      console.error('❌ onOpenSettings prop is missing!');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-white hover:text-spurs-gold transition-colors duration-200"
      >
        <div className="w-8 h-8 bg-spurs-gold rounded-full flex items-center justify-center">
          <span className="text-spurs-navy font-bold text-sm">
            {profile?.display_name?.[0] || user?.email?.[0]?.toUpperCase() || 'U'}
          </span>
        </div>
        <span className="hidden md:inline font-medium">
          {profile?.display_name || user?.email?.split('@')[0] || 'User'}
        </span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="py-2">
            <div className="px-4 py-2 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-900">
                {profile?.display_name || 'Spurs Fan'}
              </p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            <button
              onClick={handleOpenSettings}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Profile Settings
            </button>
            <button
              onClick={handleSignOut}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Main App component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
