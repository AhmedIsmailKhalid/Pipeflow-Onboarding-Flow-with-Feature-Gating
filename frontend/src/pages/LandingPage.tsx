import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const FEATURES = [
  {
    icon: '🗂️',
    title: 'Smart Onboarding',
    description:
      'Guided setup gets your team productive in minutes, not days. Every step unlocks the next feature.',
  },
  {
    icon: '🔒',
    title: 'Feature Gating',
    description:
      'Start free, unlock more as you grow. Features scale with your team — no surprise bills.',
  },
  {
    icon: '⚡',
    title: 'Built for Speed',
    description:
      'From signup to first project in under 5 minutes. We obsess over activation so you obsess over work.',
  },
]

const SOCIAL_PROOF = [
  'Vercel', 'Linear', 'Notion', 'Figma', 'Stripe', 'Loom',
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-100 max-w-6xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="font-bold text-slate-900">Pipeflow</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/auth"
            className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
          >
            Sign in
          </Link>
          <Link
            to="/auth"
            className="bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-brand-700 transition-colors"
          >
            Start free
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-brand-100 mb-6">
            🚀 Now in public beta
          </span>

          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight mb-6">
            The project tool that{' '}
            <span className="text-brand-600">actually gets</span>{' '}
            teams moving
          </h1>

          <p className="text-lg text-slate-500 mb-10 max-w-xl mx-auto leading-relaxed">
            Pipeflow guides every new user from signup to value in minutes —
            then unlocks powerful features as your team grows.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/auth"
              className="bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-700 transition-colors text-sm"
            >
              Start for free
            </Link>
            <Link
              to="/auth"
              className="bg-white text-slate-700 font-semibold px-8 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-sm"
            >
              View demo →
            </Link>
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-16"
        >
          <p className="text-xs text-slate-400 uppercase tracking-wider font-medium mb-4">
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {SOCIAL_PROOF.map((name) => (
              <span
                key={name}
                className="text-sm font-semibold text-slate-300"
              >
                {name}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-slate-50 px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-3">
            Built for activation, not just sign-ups
          </h2>
          <p className="text-slate-500 text-center mb-12 max-w-xl mx-auto text-sm">
            Most tools drop you on a blank screen. Pipeflow walks every user
            through setup and unlocks features as they go.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm"
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Ready to move faster?
        </h2>
        <p className="text-slate-500 mb-8 text-sm max-w-sm mx-auto">
          Free forever on Starter. No credit card required.
        </p>
        <Link
          to="/auth"
          className="bg-brand-600 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-brand-700 transition-colors text-sm inline-block"
        >
          Get started free
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 px-6 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-brand-600 rounded flex items-center justify-center">
              <span className="text-white text-xs font-bold">P</span>
            </div>
            <span className="text-sm font-semibold text-slate-700">
              Pipeflow
            </span>
          </div>
          <p className="text-xs text-slate-400">
            © 2026 Pipeflow. Portfolio project.
          </p>
        </div>
      </footer>
    </div>
  )
}