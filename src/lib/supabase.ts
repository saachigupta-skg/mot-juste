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

// Requires a `feedback` table:
// create table feedback (
//   id uuid default gen_random_uuid() primary key,
//   created_at timestamptz default now(),
//   message text not null,
//   email text
// );
// create policy "Anyone can insert feedback" on feedback for insert with check (true);
export async function saveFeedback(message: string, email?: string): Promise<boolean> {
  const { error } = await supabase
    .from('feedback')
    .insert({ message, email: email || null });
  return !error;
}
