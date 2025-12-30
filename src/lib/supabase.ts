import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_APP_SUPABASE_API_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface WaitlistEntry {
  id: string;
  email: string;
  unsubscribe_token: string;
  unsubscribed_at: string | null;
  created_at: string;
}
