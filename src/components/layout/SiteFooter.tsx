import opencompFavicon from '@/assets/opencomp-favicon.png'

const GITHUB_REPO_URL = 'https://github.com/fahadfazil/opencomp'

export function SiteFooter() {
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
          {['About', 'Privacy', 'Open Data', 'API', 'GitHub'].map(item => (
            <a
              key={item}
              href={item === 'GitHub' ? GITHUB_REPO_URL : '#'}
              target={item === 'GitHub' ? '_blank' : undefined}
              rel={item === 'GitHub' ? 'noopener noreferrer' : undefined}
              className="font-mono text-label-md text-on-surface-variant hover:text-primary transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
