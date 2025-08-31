import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

const SignUp = ({ onSwitchToLogin, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    favoritePlayer: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { signUp } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    const { error } = await signUp(formData.email, formData.password, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      favoritePlayer: formData.favoritePlayer
    });
    
    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
        <div className="absolute inset-0 bg-gradient-to-br from-spurs-navy/90 via-spurs-blue/90 to-spurs-navy/90" />
        
        <div className="relative bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="flex justify-center mb-6">
            <div className="bg-green-100 rounded-full p-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-spurs-navy mb-4">Welcome to Spurs Trivia!</h2>
          <p className="text-gray-600 mb-6">
            Please check your email to verify your account before you can start taking quizzes.
          </p>
          
          <button
            onClick={onSwitchToLogin}
            className="bg-spurs-navy hover:bg-spurs-blue text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      {/* Background with stadium image effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-spurs-navy/90 via-spurs-blue/90 to-spurs-navy/90" />
      
      <div className="relative bg-white bg-opacity-95 backdrop-blur-sm rounded-2xl shadow-2xl max-w-md w-full p-8 max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-spurs-navy rounded-full p-3">
              <img 
                src="/spurs-logo.png" 
                alt="Tottenham Hotspur Logo" 
                className="w-12 h-12 object-contain filter brightness-0 invert"
                loading="lazy"
              />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-spurs-navy mb-2">Join the Squad</h2>
          <p className="text-gray-600">Create your Spurs trivia account</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Sign up form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="sr-only">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white bg-opacity-60 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy transition-colors placeholder-gray-500"
                placeholder="First Name"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white bg-opacity-60 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy transition-colors placeholder-gray-500"
                placeholder="Last Name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white bg-opacity-60 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy transition-colors placeholder-gray-500"
              placeholder="Email"
            />
          </div>

          <div>
            <label htmlFor="favoritePlayer" className="sr-only">Favorite Spurs Player</label>
            <input
              id="favoritePlayer"
              name="favoritePlayer"
              type="text"
              value={formData.favoritePlayer}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white bg-opacity-60 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy transition-colors placeholder-gray-500"
              placeholder="Favorite Spurs Player (optional)"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="sr-only">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white bg-opacity-60 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy transition-colors placeholder-gray-500 pr-12"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L5.636 5.636m4.242 4.242L15.12 15.12m-4.242-4.242L5.636 5.636m0 0L3 3m2.636 2.636L12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white bg-opacity-60 border border-gray-300 rounded-lg focus:ring-2 focus:ring-spurs-navy focus:border-spurs-navy transition-colors placeholder-gray-500 pr-12"
              placeholder="Confirm Password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L5.636 5.636m4.242 4.242L15.12 15.12m-4.242-4.242L5.636 5.636m0 0L3 3m2.636 2.636L12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-spurs-gold hover:bg-yellow-500 disabled:bg-gray-300 text-spurs-navy font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-spurs-navy mr-2"></div>
                Creating Account...
              </div>
            ) : (
              'CREATE ACCOUNT'
            )}
          </button>
        </form>

        {/* Login link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-spurs-navy hover:text-spurs-blue font-semibold"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
