import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserProgress = {
  user_id: string;
  earned_categories: string[];
  streak: number;
  last_played: string | null;
};

export async function loadProgress(): Promise<UserProgress | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .single();

  return data ?? null;
}

export async function saveProgress(progress: Omit<UserProgress, 'user_id'>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('user_progress')
    .upsert({ user_id: user.id, ...progress, updated_at: new Date().toISOString() });
}
