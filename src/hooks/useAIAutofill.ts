import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAIAutofill = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingCells, setLoadingCells] = useState<Set<string>>(new Set());

  const autofillRating = async (context: {
    factorName: string;
    description?: string;
    riskContext?: string;
  }) => {
    const cellKey = `${context.factorName}-rating`;
    setLoadingCells(prev => new Set(prev).add(cellKey));
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-autofill-rating', {
        body: {
          type: 'rating',
          context
        }
      });

      if (error) throw error;

      const rating = data.result.trim();
      return rating;
    } catch (error) {
      console.error('Error autofilling rating:', error);
      toast.error('Failed to autofill rating');
      return null;
    } finally {
      setLoadingCells(prev => {
        const newSet = new Set(prev);
        newSet.delete(cellKey);
        return newSet;
      });
    }
  };

  const autofillComment = async (context: {
    factorName: string;
    description?: string;
    rating: string;
    riskContext?: string;
  }) => {
    const cellKey = `${context.factorName}-comment`;
    setLoadingCells(prev => new Set(prev).add(cellKey));
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-autofill-rating', {
        body: {
          type: 'comment',
          context
        }
      });

      if (error) throw error;

      return data.result;
    } catch (error) {
      console.error('Error autofilling comment:', error);
      toast.error('Failed to autofill comment');
      return null;
    } finally {
      setLoadingCells(prev => {
        const newSet = new Set(prev);
        newSet.delete(cellKey);
        return newSet;
      });
    }
  };

  const autofillAll = async (context: {
    riskContext?: string;
    factors: Array<{
      id: string;
      name: string;
      description?: string;
    }>;
  }) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('ai-autofill-rating', {
        body: {
          type: 'autofill-all',
          context
        }
      });

      if (error) throw error;

      // Parse the JSON response from AI
      let results;
      try {
        // Handle both direct JSON and markdown-wrapped JSON
        const responseText = data.result.trim();
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/) || 
                         responseText.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : responseText;
        results = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        toast.error('Failed to parse AI response');
        return null;
      }

      toast.success('All fields autofilled successfully!');
      return results;
    } catch (error) {
      console.error('Error autofilling all:', error);
      toast.error('Failed to autofill all fields');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const isCellLoading = (cellKey: string) => loadingCells.has(cellKey);

  return {
    autofillRating,
    autofillComment,
    autofillAll,
    isLoading,
    isCellLoading,
    loadingCells
  };
};
