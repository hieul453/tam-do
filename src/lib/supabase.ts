import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

/** Chưa cấu hình thì app vẫn chạy, chỉ không lưu tiến độ — không màn hình trắng. */
export const daCauHinhSupabase = Boolean(url && anonKey)

export const supabase = createClient(url ?? 'http://localhost:54321', anonKey ?? 'chua-cau-hinh', {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
})
