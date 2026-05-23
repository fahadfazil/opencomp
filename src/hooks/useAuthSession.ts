import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { toAppUser } from '@/services/authService'
import { useAuthStore } from '@/store'

export function useAuthSession() {
  const { setUser, setLoading } = useAuthStore()

  useEffect(() => {
    let mounted = true

    setLoading(true)

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      if (data.session?.user) {
        setUser(toAppUser(data.session.user))
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(toAppUser(session.user))
      } else {
        setUser(null)
      }
    })

    return () => {
      mounted = false
      listener.subscription.unsubscribe()
    }
  }, [setLoading, setUser])
}
