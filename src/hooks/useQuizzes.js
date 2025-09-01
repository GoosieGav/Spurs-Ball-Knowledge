import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const useQuizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('quizzes')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      // Transform data to match the expected format
      const transformedQuizzes = data.map(quiz => ({
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        categories: quiz.categories || [],
        difficulty: quiz.difficulty,
        type: quiz.type,
        questionCount: quiz.question_count,
        estimatedTime: quiz.estimated_time,
        isSpeedQuiz: quiz.is_speed_quiz,
        thumbnail: quiz.thumbnail,
        imageUrl: quiz.image_url,
        imageAlt: quiz.image_alt,
        createdAt: quiz.created_at
      }));

      setQuizzes(transformedQuizzes);
    } catch (err) {
      console.error('Error fetching quizzes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  return {
    quizzes,
    loading,
    error,
    refetch: fetchQuizzes
  };
};
