import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tag } from '@/lib/supabase';

interface TagsByType {
  categories: Tag[];
  aiModels: Tag[];
}

export function useTags() {
  const [tags, setTags] = useState<TagsByType>({
    categories: [],
    aiModels: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: tagsData, error: tagsError } = await supabase
        .from('tags')
        .select('*')
        .order('order_index', { ascending: true });

      if (tagsError) {
        throw tagsError;
      }

      // Separate tags by type
      const categories = tagsData?.filter(tag => tag.type === 'who_for') || [];
      const aiModels = tagsData?.filter(tag => tag.type === 'ai_model') || [];

      setTags({
        categories,
        aiModels
      });
    } catch (err) {
      console.error('Error fetching tags:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tags');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tags,
    isLoading,
    error,
    refetch: fetchTags
  };
}