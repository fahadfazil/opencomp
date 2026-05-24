import opencompFavicon from '@/assets/opencomp-favicon.png'
import { useUIStore } from '@/store'
import type { FooterModalKey } from '@/store'

const GITHUB_REPO_URL = 'https://github.com/fahadfazil/opencomp'

const FOOTER_LINKS: { label: string; modal?: Exclude<FooterModalKey, null>; href?: string }[] = [
  { label: 'About', modal: 'about' },
  { label: 'Privacy', modal: 'privacy' },
  { label: 'Open Data', modal: 'open-data' },
  { label: 'API', modal: 'api' },
  { label: 'GitHub', href: GITHUB_REPO_URL },
]

export function SiteFooter() {
  const { setFooterModal } = useUIStore()

  return (
    <footer className="border-t border-white/5 py-10 px-6 md:px-8">
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
          <img
            src={opencompFavicon}
            alt="OpenComp icon"
            className="h-6 w-6 shrink-0 rounded-md object-contain"
          />
          <span className="text-center text-body-md text-on-surface-variant md:text-left">
            · Open-source workplace intelligence for India
          </span>
        </div>
        <div className="flex items-center gap-6">
          {FOOTER_LINKS.map(({ label, modal, href }) =>
            href ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-label-md text-on-surface-variant hover:text-primary transition-colors"
              >
                {label}
              </a>
            ) : (
              <button
                key={label}
                onClick={() => setFooterModal(modal!)}
                className="font-mono text-label-md text-on-surface-variant hover:text-primary transition-colors"
              >
                {label}
              </button>
            )
          )}
        </div>
      </div>
    </footer>
  )
}
