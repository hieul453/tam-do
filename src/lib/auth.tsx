import { createContext, useContext, useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase, daCauHinhSupabase } from './supabase'

/**
 * Vào là dùng được ngay: tự tạo phiên ẩn danh, có user_id thật, ghi thẳng vào
 * Postgres. Khi muốn giữ tiến độ thì liên kết Google — user_id KHÔNG đổi nên
 * không phải chuyển dữ liệu đi đâu.
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
        const { data: anon, error } = await supabase.auth.signInAnonymously()
        if (error) console.error('Không tạo được phiên ẩn danh:', error.message)
        if (!huy) setSession(anon?.session ?? null)
      }
      if (!huy) setDangTai(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s))
    return () => {
      huy = true
      sub.subscription.unsubscribe()
    }
  }, [])

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
    <AuthContext.Provider
      value={{
        session,
        dangTai,
        laAnDanh: Boolean(session?.user.is_anonymous),
        lienKetGoogle,
        dangXuat,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth phải nằm trong <AuthProvider>')
  return ctx
}
