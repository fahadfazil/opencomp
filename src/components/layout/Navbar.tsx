import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Search, Bell, Menu, X, MapPin,
  Building2, Briefcase, PlusCircle, BarChart3
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/utils'
import { useAuthStore, useUIStore } from '@/store'
import { Button } from '@/components/ui'
import opencompFavicon from '@/assets/opencomp-favicon.png'
import opencompLogo from '@/assets/opencomp-logo.png'

const NAV_ITEMS = [
  { label: 'Intelligence', href: '/', icon: BarChart3 },
  { label: 'Companies', href: '/companies', icon: Building2 },
  { label: 'Cities', href: '/cities', icon: MapPin },
  { label: 'Roles', href: '/roles', icon: Briefcase },
]

export function Navbar() {
  const location = useLocation()
  const { user } = useAuthStore()
  const { setAuthModalOpen, setContributeModalOpen, toggleCommandPalette } = useUIStore()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        toggleCommandPalette()
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [toggleCommandPalette])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-surface/90 backdrop-blur-xl border-b border-white/8 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-[1440px] mx-auto px-6 md:px-8 h-16 flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={opencompFavicon}
              alt=""
              className="h-8 w-8 rounded-lg object-contain"
            />
            <img
              src={opencompLogo}
              alt="OpenComp"
              className="h-7 w-[8.75rem] object-cover object-center"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href ||
                (item.href !== '/' && location.pathname.startsWith(item.href))

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-150 font-mono text-label-md tracking-wider',
                    isActive
                      ? 'text-primary bg-primary/8'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  )}
                >
                  <Icon size={13} strokeWidth={2} />
                  {item.label.toUpperCase()}
                </Link>
              )
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Search trigger */}
            <button
              onClick={toggleCommandPalette}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/50 text-on-surface-variant hover:border-primary/30 hover:text-on-surface transition-all text-body-md"
            >
              <Search size={14} />
              <span className="text-sm">Search...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high border border-outline-variant font-mono text-[10px] text-outline ml-2">
                ⌘K
              </kbd>
            </button>

            <button
              className="md:hidden text-on-surface-variant hover:text-primary transition-colors"
              onClick={toggleCommandPalette}
            >
              <Search size={18} />
            </button>

            {user ? (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={<PlusCircle size={14} />}
                  onClick={() => setContributeModalOpen(true)}
                  className="hidden md:flex"
                >
                  Contribute
                </Button>
                <button className="text-on-surface-variant hover:text-primary transition-colors relative">
                  <Bell size={18} />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-secondary rounded-full" />
                </button>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20 cursor-pointer">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.display_name || 'User'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                      {(user.display_name || user.email)[0].toUpperCase()}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAuthModalOpen(true)}
                  className="hidden md:flex"
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setContributeModalOpen(true)}
                >
                  Contribute
                </Button>
              </>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden text-on-surface-variant hover:text-primary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-16 left-0 right-0 z-40 bg-surface-container-low border-b border-white/8 md:hidden"
          >
            <nav className="px-6 py-4 space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg font-mono text-label-md tracking-wider transition-colors',
                      isActive
                        ? 'text-primary bg-primary/8'
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                    )}
                  >
                    <Icon size={16} />
                    {item.label.toUpperCase()}
                  </Link>
                )
              })}

              <div className="pt-3 border-t border-white/8 flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => { setAuthModalOpen(true); setMobileOpen(false) }}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className="flex-1"
                  onClick={() => { setContributeModalOpen(true); setMobileOpen(false) }}
                >
                  Contribute
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
