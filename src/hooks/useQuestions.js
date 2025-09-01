import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export const useQuestions = (quizId) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQuestions = useCallback(async () => {
    if (!quizId) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('order_index', { ascending: true });

      if (error) {
        throw error;
      }

      // Transform data to match the expected format
      const transformedQuestions = data.map(question => ({
        id: question.id,
        text: question.text,
        type: question.type,
        options: question.options,
        correctAnswer: question.correct_answer,
        explanation: question.explanation
      }));

      setQuestions(transformedQuestions);
    } catch (err) {
      console.error('Error fetching questions:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  return {
    questions,
    loading,
    error,
    refetch: fetchQuestions
  };
};
