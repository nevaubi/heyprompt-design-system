import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Re-export the supabase client
export { supabase };

// Export type helpers
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Database table types
export type Tag = Tables<'tags'>;
export type Prompt = Tables<'prompts'>;
export type PromptTag = Tables<'prompt_tags'>;
export type UserProfile = Tables<'user_profiles'>;
export type UserInteraction = Tables<'user_interactions'>;
export type Rating = Tables<'ratings'>;
export type Comment = Tables<'comments'>;

// Custom types for the application
export type TagType = 'who_for' | 'ai_model';
export type TokenUsage = 'low' | 'medium' | 'high';
export type InteractionType = 'like' | 'bookmark' | 'copy';

// Extended types with relationships
export interface PromptWithTags extends Prompt {
  tags?: Tag[];
  who_for_tags?: Tag[];
  ai_model_tags?: Tag[];
  avg_rating?: number;
  rating_count?: number;
  like_count?: number;
  bookmark_count?: number;
  comment_count?: number;
  user_profile?: UserProfile;
}

export interface PromptWithInteractions extends PromptWithTags {
  user_has_liked?: boolean;
  user_has_bookmarked?: boolean;
  user_rating?: number;
}

export interface CommentWithProfile extends Comment {
  user_profile?: UserProfile;
}

// API response types
export interface PromptsResponse {
  data: PromptWithTags[];
  count: number;
  page: number;
  per_page: number;
}

// Filter types
export interface PromptFilters {
  categories?: string[];
  ai_models?: string[];
  token_usage?: TokenUsage[];
  min_rating?: number;
  search?: string;
}

export interface SortOptions {
  field: 'created_at' | 'view_count' | 'copy_count' | 'avg_rating';
  direction: 'asc' | 'desc';
}