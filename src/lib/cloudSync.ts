import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { UserProgress } from '../types/curriculum';
import { DEFAULT_PROGRESS, DEFAULT_SETTINGS } from './storage';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const GITHUB_REPO = (import.meta.env.VITE_GITHUB_REPO as string | undefined)?.trim() || '';

let client: SupabaseClient | null = null;

export function isCloudSyncConfigured(): boolean {
  return Boolean(SUPABASE_URL?.trim() && SUPABASE_ANON_KEY?.trim());
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!isCloudSyncConfigured()) return null;
  if (!client) {
    client = createClient(SUPABASE_URL!.trim(), SUPABASE_ANON_KEY!.trim(), {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      }
    });
  }
  return client;
}

export async function getCurrentCloudUser(): Promise<User | null> {
  const sb = getSupabaseClient();
  if (!sb) return null;
  const { data } = await sb.auth.getUser();
  return data.user ?? null;
}

export async function signUpWithEmail(
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null; needsConfirm: boolean }> {
  const sb = getSupabaseClient();
  if (!sb) return { user: null, error: '当前站点未配置云同步服务。', needsConfirm: false };

  const { data, error } = await sb.auth.signUp({ email: email.trim(), password });
  if (error) return { user: null, error: error.message, needsConfirm: false };
  return {
    user: data.user ?? null,
    error: null,
    needsConfirm: Boolean(data.user && !data.session)
  };
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<{ user: User | null; error: string | null }> {
  const sb = getSupabaseClient();
  if (!sb) return { user: null, error: '当前站点未配置云同步服务。' };

  const { data, error } = await sb.auth.signInWithPassword({ email: email.trim(), password });
  if (error) return { user: null, error: error.message };
  return { user: data.user ?? null, error: null };
}

export async function signOutCloud(): Promise<void> {
  const sb = getSupabaseClient();
  if (!sb) return;
  await sb.auth.signOut();
}

export async function pullCloudProgress(userId: string): Promise<UserProgress | null> {
  const sb = getSupabaseClient();
  if (!sb) return null;

  const { data, error } = await sb
    .from('user_progress')
    .select('progress_json')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data?.progress_json) return null;
  const parsed = data.progress_json as Partial<UserProgress>;
  return {
    ...DEFAULT_PROGRESS,
    ...parsed,
    settings: {
      ...DEFAULT_SETTINGS,
      ...(parsed.settings ?? {})
    }
  };
}

export async function pushCloudProgress(
  userId: string,
  progress: UserProgress
): Promise<{ ok: boolean; error?: string }> {
  const sb = getSupabaseClient();
  if (!sb) return { ok: false, error: '未配置云同步' };

  const { error } = await sb.from('user_progress').upsert(
    {
      user_id: userId,
      progress_json: progress,
      updated_at: new Date().toISOString()
    },
    { onConflict: 'user_id' }
  );

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

export interface BetaFeedbackPayload {
  category: 'bug' | 'grammar' | 'feature' | 'praise';
  rating: number;
  testerName: string;
  message: string;
  contextPage: string;
  deviceInfo: string;
}

export async function submitCloudFeedback(
  payload: BetaFeedbackPayload
): Promise<{ ok: boolean; error?: string }> {
  const sb = getSupabaseClient();
  if (!sb) return { ok: false, error: '云端反馈未配置' };

  const { error } = await sb.from('beta_feedback').insert({
    category: payload.category,
    rating: payload.rating,
    tester_name: payload.testerName || '匿名测试者',
    message: payload.message,
    context_page: payload.contextPage,
    device_info: payload.deviceInfo
  });

  if (error) return { ok: false, error: error.message };
  return { ok: true };
}
