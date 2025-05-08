import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/supabase';

// Create a single supabase client for the entire application
export const createClient = () => {
  return createClientComponentClient<Database>();
};