import { motion, AnimatePresence } from 'framer-motion'
import { X, Shield, Lock } from 'lucide-react'
import { useState } from 'react'
import opencompFavicon from '@/assets/opencomp-favicon.png'
import { useUIStore } from '@/store'
import { signInWithOAuth } from '@/services/authService'

type ProviderIconProps = {
  className?: string
}

function GoogleIcon({ className }: ProviderIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path fill="#EA4335" d="M12 10.2v3.95h5.5c-.22 1.27-.96 2.35-2.07 3.07l3.35 2.6c1.95-1.8 3.08-4.45 3.08-7.62 0-.72-.06-1.41-.2-2H12z" />
      <path fill="#34A853" d="M12 22c2.79 0 5.13-.93 6.84-2.53l-3.35-2.6c-.93.62-2.12 1-3.5 1-2.69 0-4.97-1.82-5.79-4.26H2.76v2.69A10 10 0 0 0 12 22z" />
      <path fill="#FBBC05" d="M6.21 13.61A5.96 5.96 0 0 1 5.9 12c0-.56.1-1.1.31-1.61V7.7H2.76A10 10 0 0 0 2 12c0 1.61.39 3.13 1.07 4.3l3.14-2.69z" />
      <path fill="#4285F4" d="M12 6.13c1.52 0 2.88.52 3.95 1.54l2.97-2.97C17.13 3.05 14.79 2 12 2A10 10 0 0 0 2.76 7.7l3.45 2.69C7.03 7.95 9.31 6.13 12 6.13z" />
    </svg>
  )
}

function GitHubIcon({ className }: ProviderIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#E6EDF3"
        d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.43 7.88 10.96.58.1.8-.25.8-.57v-2c-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.27-1.69-1.27-1.69-1.04-.7.08-.69.08-.69 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.25 3.32.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.25.44-2.27 1.18-3.07-.12-.29-.52-1.47.11-3.06 0 0 .96-.31 3.14 1.17a10.93 10.93 0 0 1 5.72 0c2.18-1.48 3.14-1.17 3.14-1.17.63 1.6.23 2.77.11 3.06.73.8 1.18 1.82 1.18 3.07 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.07.78 2.16v3.2c0 .31.21.67.81.56A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"
      />
    </svg>
  )
}

function LinkedInIcon({ className }: ProviderIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="#0A66C2"
        d="M19 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.34 18H5.67V9.42h2.67V18zM7 8.25a1.55 1.55 0 1 1 0-3.1 1.55 1.55 0 0 1 0 3.1zM18 18h-2.66v-4.17c0-1-.02-2.28-1.39-2.28-1.39 0-1.6 1.09-1.6 2.2V18H9.68V9.42h2.56v1.17h.04a2.81 2.81 0 0 1 2.53-1.39c2.7 0 3.2 1.78 3.2 4.08V18z"
      />
    </svg>
  )
}

export function AuthModal() {
  const { authModalOpen, setAuthModalOpen } = useUIStore()
  const [loadingProvider, setLoadingProvider] = useState<'google' | 'github' | 'linkedin' | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  const handleLogin = async (provider: 'google' | 'github' | 'linkedin') => {
    setLoadingProvider(provider)
    setAuthError(null)
    const { error } = await signInWithOAuth(provider)
    if (error) {
      setAuthError(error.message)
      setLoadingProvider(null)
      return
    }
    setAuthModalOpen(false)
  }

  return (
    <AnimatePresence>
      {authModalOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
            onClick={() => setAuthModalOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[201] flex items-center justify-center px-4 py-6"
          >
            <div className="w-full max-w-md">
              <div className="glass-card border border-white/10 p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <img
                    src={opencompFavicon}
                    alt="OpenComp icon"
                    className="h-8 w-8 rounded-lg object-contain"
                  />
                  <div>
                    <div className="font-bold text-on-surface">Sign In to OpenComp</div>
                    <div className="font-mono text-label-md text-on-surface-variant">
                      CONTRIBUTE ANONYMOUSLY
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setAuthModalOpen(false)}
                  className="text-on-surface-variant hover:text-on-surface transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Privacy notice */}
              <div className="mb-6 p-4 bg-secondary/5 border border-secondary/15 rounded-xl flex gap-3">
                <Shield size={18} className="text-secondary shrink-0 mt-0.5" />
                <div>
                  <div className="text-body-md text-secondary font-medium mb-1">
                    Your identity stays anonymous
                  </div>
                  <div className="text-body-md text-on-surface-variant">
                    We only use your login to prevent spam. Your public contributions are
                    completely anonymous — no name, no email, no identifying info.
                  </div>
                </div>
              </div>

              {/* Login buttons */}
              <div className="space-y-3">
                <button
                  disabled={!!loadingProvider}
                  onClick={() => handleLogin('google')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 bg-surface-container border border-outline-variant rounded-xl hover:border-primary/30 hover:bg-surface-container-high transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <GoogleIcon className="h-[18px] w-[18px] transition-all group-hover:scale-105" />
                  </div>
                  <span className="text-body-md text-on-surface font-medium">
                    Continue with Google
                  </span>
                  <span className="ml-auto font-mono text-label-md text-on-surface-variant">
                    RECOMMENDED
                  </span>
                </button>

                <button
                  disabled={!!loadingProvider}
                  onClick={() => handleLogin('github')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 bg-surface-container border border-outline-variant rounded-xl hover:border-primary/30 hover:bg-surface-container-high transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <GitHubIcon className="h-[18px] w-[18px] transition-all group-hover:scale-105" />
                  </div>
                  <span className="text-body-md text-on-surface font-medium">
                    Continue with GitHub
                  </span>
                </button>

                <button
                  disabled={!!loadingProvider}
                  onClick={() => handleLogin('linkedin')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 bg-surface-container border border-outline-variant rounded-xl hover:border-primary/30 hover:bg-surface-container-high transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#0077B5]/20 flex items-center justify-center">
                    <LinkedInIcon className="h-[18px] w-[18px] transition-all group-hover:scale-105" />
                  </div>
                  <span className="text-body-md text-on-surface font-medium">
                    Continue with LinkedIn
                  </span>
                </button>
              </div>
              {loadingProvider && (
                <p className="mt-3 text-body-md text-on-surface-variant">
                  Redirecting to {loadingProvider} authentication...
                </p>
              )}
              {authError && (
                <p className="mt-3 text-body-md text-error">
                  {authError}
                </p>
              )}

              {/* Footer */}
              <div className="mt-6 flex items-center gap-2 text-on-surface-variant">
                <Lock size={13} />
                <p className="text-body-md">
                  By signing in, you agree to our anonymous contribution policy.
                  No personal data is ever made public.
                </p>
              </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
