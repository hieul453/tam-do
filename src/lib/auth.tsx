import { createContext, useContext, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, daCauHinhSupabase } from './supabase'

/**
 * Luồng đăng nhập theo "phương án B" trong CLAUDE.md mục 10:
 *
 *   1. Mở app lần đầu  -> tự tạo phiên ẩn danh (signInAnonymously).
 *      Người dùng có user_id thật ngay, dữ liệu ghi thẳng vào Postgres.
 *   2. Muốn giữ tiến độ -> liên kết phiên đó với Google (linkIdentity).
 *      user_id KHÔNG đổi, nên không phải chuyển dữ liệu đi đâu cả.
 *
 * Để bước 2 chạy được, trong Supabase Dashboard phải bật:
 *   Authentication -> Sign In / Providers -> Anonymous sign-ins
 *   Authentication -> Sign In / Providers -> Google
 *   Authentication -> Advanced -> Manual linking
 */

type TrangThaiAuth = {
  session: Session | null
  dangTai: boolean
  laAnDanh: boolean
  lienKetGoogle: () => Promise<void>
  dangXuat: () => Promise<void>
}

const AuthContext = createContext<TrangThaiAuth | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [dangTai, setDangTai] = useState(true)

  useEffect(() => {
    if (!daCauHinhSupabase) {
      setDangTai(false)
      return
    }

    let huy = false

    supabase.auth.getSession().then(async ({ data }) => {
      if (huy) return
      if (data.session) {
        setSession(data.session)
      } else {
        // Chưa có phiên nào: vào là dùng được ngay, không bắt đăng nhập.
        const { data: anon, error } = await supabase.auth.signInAnonymously()
        if (error) console.error('Không tạo được phiên ẩn danh:', error.message)
        if (!huy) setSession(anon?.session ?? null)
      }
      if (!huy) setDangTai(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })

    return () => {
      huy = true
      sub.subscription.unsubscribe()
    }
  }, [])

  const laAnDanh = Boolean(session?.user.is_anonymous)

  async function lienKetGoogle() {
    const { error } = await supabase.auth.linkIdentity({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) throw error
  }

  async function dangXuat() {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ session, dangTai, laAnDanh, lienKetGoogle, dangXuat }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải nằm trong <AuthProvider>')
  return ctx
}
