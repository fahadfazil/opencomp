import { motion, AnimatePresence } from 'framer-motion'
import { X, Info, Shield, Database, Code2 } from 'lucide-react'
import { useUIStore } from '@/store'
import type { FooterModalKey } from '@/store'

// ─── Content ────────────────────────────────────────────────────────────────

function buildModalContent(
  setFooterModal: (modal: FooterModalKey) => void
): Record<
  Exclude<FooterModalKey, null>,
  { icon: React.ReactNode; title: string; body: React.ReactNode }
> {
  return {
  about: {
    icon: <Info size={18} className="text-primary" />,
    title: 'About OpenComp',
    body: (
      <div className="space-y-4 text-body-md text-on-surface-variant leading-relaxed">
        <p>
          <span className="text-on-surface font-semibold">OpenComp</span> is an open-source
          workplace intelligence and salary transparency platform built for India's tech
          ecosystem. Our mission is to give every professional access to the same data that
          companies have always kept to themselves.
        </p>
        <p>
          We aggregate anonymous salary reports, workplace culture ratings, and office-area
          intelligence into a single, interactive map-first experience — think of it as the
          open-source Bloomberg Terminal for workplace data.
        </p>
        <ul className="space-y-2 border-l-2 border-primary/30 pl-4">
          <li>🌍 Community-owned and fully transparent</li>
          <li>🔒 Contributor identities are never exposed</li>
          <li>📊 Real-time compensation benchmarking</li>
          <li>🗺️ Geographic workplace insights across India</li>
        </ul>
        <p>
          OpenComp is free forever. No ads, no dark patterns, no paywalls. The source code is
          available on{' '}
          <a
            href="https://github.com/fahadfazil/opencomp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub
          </a>
          .
        </p>
      </div>
    ),
  },
  privacy: {
    icon: <Shield size={18} className="text-secondary" />,
    title: 'Privacy Policy',
    body: (
      <div className="space-y-4 text-body-md text-on-surface-variant leading-relaxed">
        <p>
          Your privacy is the foundation of OpenComp. We designed every system from the ground
          up to collect the minimum data required and to keep it safe.
        </p>
        <div className="space-y-3">
          <Section heading="Authentication">
            We use OAuth (Google, GitHub, LinkedIn) solely to prevent spam and duplicate
            submissions. We never store your password.
          </Section>
          <Section heading="Anonymous contributions">
            All public salary and culture data is stripped of any identifying information
            before it is stored. No name, email, employer ID, or location metadata is ever
            attached to your submission.
          </Section>
          <Section heading="Data we do not collect">
            We do not run advertising trackers, sell your data, or share it with third parties.
            We use privacy-respecting analytics (aggregate page-view counts only).
          </Section>
          <Section heading="Data retention">
            You may request deletion of your account and all associated submissions at any
            time by contacting us via GitHub Issues.
          </Section>
        </div>
      </div>
    ),
  },
  'open-data': {
    icon: <Database size={18} className="text-tertiary" />,
    title: 'Open Data',
    body: (
      <div className="space-y-4 text-body-md text-on-surface-variant leading-relaxed">
        <p>
          We believe compensation data should be a public good. OpenComp publishes aggregated,
          anonymised datasets so researchers, journalists, and developers can build on top of
          our community's knowledge.
        </p>
        <div className="space-y-3">
          <Section heading="What's available">
            Aggregated salary percentiles by city, role, and experience band. Workplace culture
            scores. Office-area intelligence heatmaps. All datasets are updated weekly.
          </Section>
          <Section heading="Licence">
            Data is released under the{' '}
            <a
              href="https://opendatacommons.org/licenses/odbl/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Open Database Licence (ODbL)
            </a>
            . You are free to share and adapt the data for any purpose, provided you attribute
            OpenComp and keep derivative datasets open.
          </Section>
          <Section heading="Download">
            Bulk CSV exports are available via the API. See the{' '}
            <button
              className="text-primary hover:underline"
              onClick={() => setFooterModal('api')}
            >
              API docs
            </button>{' '}
            for details.
          </Section>
        </div>
      </div>
    ),
  },
  api: {
    icon: <Code2 size={18} className="text-primary" />,
    title: 'Public API',
    body: (
      <div className="space-y-4 text-body-md text-on-surface-variant leading-relaxed">
        <p>
          OpenComp exposes a read-only REST API backed by Supabase. All endpoints are public
          and require no authentication for read access.
        </p>
        <div className="space-y-3">
          <Section heading="Base URL">
            <code className="font-mono text-primary bg-surface-container px-2 py-0.5 rounded text-sm">
              https://&lt;project-ref&gt;.supabase.co/rest/v1
            </code>
          </Section>
          <Section heading="Key endpoints">
            <ul className="mt-1 space-y-1 font-mono text-sm">
              <li>
                <span className="text-secondary">GET</span>{' '}
                <span className="text-on-surface">/salary_entries</span>
              </li>
              <li>
                <span className="text-secondary">GET</span>{' '}
                <span className="text-on-surface">/companies</span>
              </li>
              <li>
                <span className="text-secondary">GET</span>{' '}
                <span className="text-on-surface">/cities</span>
              </li>
              <li>
                <span className="text-secondary">GET</span>{' '}
                <span className="text-on-surface">/roles</span>
              </li>
              <li>
                <span className="text-secondary">GET</span>{' '}
                <span className="text-on-surface">/workplace_scores</span>
              </li>
            </ul>
          </Section>
          <Section heading="Authentication">
            Pass your Supabase anon key as the{' '}
            <code className="font-mono text-primary bg-surface-container px-1.5 py-0.5 rounded text-sm">
              apikey
            </code>{' '}
            header. The anon key is safe to use in public clients.
          </Section>
          <Section heading="Rate limits">
            The API is rate-limited to 100 requests / minute per IP. For bulk access use the
            Open Data CSV exports.
          </Section>
        </div>
        <p>
          Full documentation and code samples are maintained in the{' '}
          <a
            href="https://github.com/fahadfazil/opencomp"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            GitHub repository
          </a>
          .
        </p>
      </div>
    ),
  },
  }
}

function Section({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="font-semibold text-on-surface mb-1">{heading}</div>
      <div>{children}</div>
    </div>
  )
}

// ─── Modal ───────────────────────────────────────────────────────────────────

export function FooterModal() {
  const { footerModal, setFooterModal } = useUIStore()
  const close = () => setFooterModal(null)

  const MODAL_CONTENT = buildModalContent(setFooterModal)
  const content = footerModal ? MODAL_CONTENT[footerModal] : null

  return (
    <AnimatePresence>
      {footerModal && content && (
        <>
          {/* Backdrop */}
          <motion.div
            key="footer-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
            onClick={close}
          />

          {/* Panel */}
          <motion.div
            key="footer-modal-panel"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[201] flex items-center justify-center px-4 py-6"
          >
            <div className="w-full max-w-lg max-h-[85vh] flex flex-col">
              <div className="glass-card border border-white/10 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
                  <div className="flex items-center gap-2.5">
                    {content.icon}
                    <span className="font-bold text-on-surface">{content.title}</span>
                  </div>
                  <button
                    onClick={close}
                    className="text-on-surface-variant hover:text-on-surface transition-colors"
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Body */}
                <div className="overflow-y-auto px-6 py-5">{content.body}</div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
