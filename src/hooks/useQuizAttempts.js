import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';

export const useQuizAttempts = () => {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAttempts = useCallback(async () => {
    if (!user) {
      setAttempts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('quiz_attempts')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform data to match the expected format
      const transformedAttempts = data.map(attempt => ({
        id: attempt.id,
        quizName: attempt.quiz_name,
        date: attempt.completed_at.split('T')[0], // Extract date from timestamp
        score: { 
          correct: attempt.score, 
          total: attempt.total_questions 
        },
        percent: Math.round(attempt.percentage),
        time: formatTime(attempt.time_taken),
        details: attempt.answers || []
      }));

      setAttempts(transformedAttempts);
    } catch (err) {
      console.error('Error fetching quiz attempts:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAttempts();
  }, [fetchAttempts]);

  return {
    attempts,
    loading,
    error,
    refetch: fetchAttempts
  };
};

// Helper function to format time from seconds to MM:SS format
const formatTime = (timeInSeconds) => {
  if (!timeInSeconds) return '0:00';
  
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Helper function to calculate overall stats
export const calculateOverallStats = (attempts) => {
  if (attempts.length === 0) {
    return {
      averageScore: 0,
      bestScore: 0,
      totalQuizzes: 0
    };
  }

  const totalPercent = attempts.reduce((sum, attempt) => sum + attempt.percent, 0);
  const averageScore = Math.round(totalPercent / attempts.length);
  const bestScore = Math.max(...attempts.map(attempt => attempt.percent));
  const totalQuizzes = attempts.length;

  return {
    averageScore,
    bestScore,
    totalQuizzes
  };
};

// Helper function to get score color
export const getScoreColor = (percent) => {
  if (percent >= 80) return 'text-green-600 bg-green-100';
  if (percent >= 50) return 'text-yellow-700 bg-yellow-100';
  return 'text-red-600 bg-red-100';
};

// Helper function to format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
