import { motion, AnimatePresence } from 'framer-motion'
import { X, GitBranch, Globe, Link, Shield, Lock, Eye } from 'lucide-react'
const Github = GitBranch
const Chrome = Globe
const Linkedin = Link
import { useUIStore, useAuthStore } from '@/store'
import { Button } from '@/components/ui'
import type { User } from '@/types'

// Mock user for demo purposes
const MOCK_USER: User = {
  id: 'user_demo_1',
  email: 'anon@opencomp.in',
  display_name: 'Anonymous Contributor',
  avatar_url: null,
  provider: 'google',
  created_at: new Date().toISOString(),
  contributions_count: 3,
  is_verified: true,
}

export function AuthModal() {
  const { authModalOpen, setAuthModalOpen } = useUIStore()
  const { setUser } = useAuthStore()

  const handleLogin = (provider: 'google' | 'github' | 'linkedin') => {
    // In production: trigger supabase.auth.signInWithOAuth({ provider })
    setUser({ ...MOCK_USER, provider })
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-full max-w-md px-4"
          >
            <div className="glass-card border border-white/10 p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <GitBranch size={16} className="text-on-primary" strokeWidth={2.5} />
                  </div>
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
                  onClick={() => handleLogin('google')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 bg-surface-container border border-outline-variant rounded-xl hover:border-primary/30 hover:bg-surface-container-high transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Chrome size={18} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-body-md text-on-surface font-medium">
                    Continue with Google
                  </span>
                  <span className="ml-auto font-mono text-label-md text-on-surface-variant">
                    RECOMMENDED
                  </span>
                </button>

                <button
                  onClick={() => handleLogin('github')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 bg-surface-container border border-outline-variant rounded-xl hover:border-primary/30 hover:bg-surface-container-high transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <Github size={18} className="text-on-surface-variant group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-body-md text-on-surface font-medium">
                    Continue with GitHub
                  </span>
                </button>

                <button
                  onClick={() => handleLogin('linkedin')}
                  className="w-full flex items-center gap-3 px-4 py-3.5 bg-surface-container border border-outline-variant rounded-xl hover:border-primary/30 hover:bg-surface-container-high transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#0077B5]/20 flex items-center justify-center">
                    <Linkedin size={18} className="text-[#0077B5] group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-body-md text-on-surface font-medium">
                    Continue with LinkedIn
                  </span>
                </button>
              </div>

              {/* Footer */}
              <div className="mt-6 flex items-center gap-2 text-on-surface-variant">
                <Lock size={13} />
                <p className="text-body-md">
                  By signing in, you agree to our anonymous contribution policy.
                  No personal data is ever made public.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
