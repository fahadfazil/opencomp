import type { Session, User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { User } from '@/types'

const providerMap: Record<string, User['provider']> = {
  google: 'google',
  github: 'github',
  linkedin_oidc: 'linkedin',
  linkedin: 'linkedin',
}

export function toAppUser(supabaseUser: SupabaseUser): User {
  const provider = supabaseUser.app_metadata?.provider as string | undefined
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? '',
    display_name:
      (supabaseUser.user_metadata?.full_name as string | undefined) ||
      (supabaseUser.user_metadata?.name as string | undefined) ||
      (supabaseUser.user_metadata?.user_name as string | undefined) ||
      null,
    avatar_url: (supabaseUser.user_metadata?.avatar_url as string | undefined) ?? null,
    provider: providerMap[provider ?? 'google'] ?? 'google',
    created_at: supabaseUser.created_at,
    contributions_count: 0,
    is_verified: !!supabaseUser.email_confirmed_at,
  }
}

export async function signInWithOAuth(provider: User['provider']) {
  const mappedProvider = provider === 'linkedin' ? 'linkedin_oidc' : provider
  return supabase.auth.signInWithOAuth({
    provider: mappedProvider,
    options: {
      redirectTo: window.location.origin,
    },
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession()
  return data.session
}
