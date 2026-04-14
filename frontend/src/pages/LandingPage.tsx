import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const FEATURES = [
  {
    number: '01',
    title: 'Smart Onboarding',
    description: 'Guided setup gets your team productive in minutes. Every completed step unlocks the next feature — no blank screens, no confusion.',
    accent: 'text-brand-600',
  },
  {
    number: '02',
    title: 'Feature Gating',
    description: 'Start free, unlock more as you grow. Features scale with your plan and your progress — no surprise bills, no wasted seats.',
    accent: 'text-emerald-600',
  },
  {
    number: '03',
    title: 'Built for Activation',
    description: 'From signup to first project in under 5 minutes. We obsess over the activation metric so you can obsess over the work.',
    accent: 'text-amber-600',
  },
]

const PRICING = [
  {
    name: 'Starter',
    price: 'Free',
    description: 'For individuals getting started.',
    features: ['Projects & tasks', 'Basic analytics', 'Up to 3 members', 'Community support'],
    cta: 'Start for free',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$29',
    period: '/mo',
    description: 'For growing teams that need more.',
    features: ['Everything in Starter', 'Integrations (Slack, GitHub)', 'Team management', 'Custom branding', 'Priority support'],
    cta: 'Start free trial',
    highlight: true,
  },
  {
    name: 'Scale',
    price: '$99',
    period: '/mo',
    description: 'For large teams, advanced needs.',
    features: ['Everything in Growth', 'Advanced reports', 'API access', 'SSO & SAML', 'Dedicated support'],
    cta: 'Contact sales',
    highlight: false,
  },
]

const LOGOS = ['Vercel', 'Linear', 'Notion', 'Figma', 'Stripe', 'Loom']

const STATS = [
  { value: '< 5 min', label: 'Avg. time to first project' },
  { value: '3.2×',    label: 'Higher activation vs baseline' },
  { value: '94%',     label: 'User retention at 30 days' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      {/* Nav */}
      <nav className="border-b border-stone-200 bg-white/80 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center">
              <span className="text-white text-2xs font-bold">PF</span>
            </div>
            <span className="font-semibold text-stone-900 text-sm tracking-tight">Pipeflow</span>
          </div>
          <div className="flex items-center gap-1">
            <Link
              to="/auth"
              className="text-sm text-stone-500 hover:text-stone-800 font-medium px-3 py-1.5 rounded hover:bg-stone-100 transition-colors"
            >
              Sign in
            </Link>
            <Link
              to="/auth"
              className="text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-1.5 rounded transition-colors"
            >
              Start free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 text-xs font-medium text-brand-700 bg-brand-50 border border-brand-200 px-3 py-1 rounded-full mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse-dot" />
            Now in public beta
          </div>

          <h1 className="text-5xl font-bold text-stone-900 leading-tight tracking-tight mb-5">
            The project tool that{' '}
            <span className="text-brand-600">actually gets</span>{' '}
            teams moving
          </h1>

          <p className="text-base text-stone-500 leading-relaxed mb-8 max-w-xl">
            Pipeflow guides every new user from signup to value in minutes —
            then unlocks powerful features as your team grows.
          </p>

          <div className="flex items-center gap-3 mb-12">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 bg-brand-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-brand-700 transition-colors"
            >
              Start for free <span>→</span>
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors"
            >
              View demo <span className="text-stone-400">↗</span>
            </Link>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-6">
            {STATS.map((stat) => (
              <div key={stat.label} className="border-l-2 border-brand-300 pl-4">
                <p className="font-numeric text-2xl font-bold text-stone-900">{stat.value}</p>
                <p className="text-xs text-stone-400 mt-1 leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Social proof */}
      <section className="border-y border-stone-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center gap-8 flex-wrap">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest flex-shrink-0">
              Trusted by teams at
            </p>
            <div className="flex items-center gap-8 flex-wrap">
              {LOGOS.map((name) => (
                <span key={name} className="text-sm font-semibold text-stone-300">
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="mb-16">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
            Why Pipeflow
          </p>
          <h2 className="text-3xl font-bold text-stone-900 tracking-tight max-w-lg">
            Built for activation, not just sign-ups
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-stone-200">
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="bg-stone-50 p-8 hover:bg-white transition-colors"
            >
              <p className={`font-numeric text-4xl font-bold mb-6 ${feature.accent} opacity-30`}>
                {feature.number}
              </p>
              <h3 className="text-base font-semibold text-stone-900 mb-3">{feature.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-stone-200 bg-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
              Pricing
            </p>
            <h2 className="text-3xl font-bold text-stone-900 tracking-tight">
              Simple, transparent pricing
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {PRICING.map((plan) => (
              <div
                key={plan.name}
                className={`rounded-xl p-6 flex flex-col border ${
                  plan.highlight
                    ? 'border-brand-300 bg-brand-50 ring-1 ring-brand-300'
                    : 'border-stone-200 bg-stone-50'
                }`}
              >
                {plan.highlight && (
                  <div className="mb-4">
                    <span className="text-2xs font-bold text-brand-700 bg-brand-100 border border-brand-200 px-2 py-0.5 rounded-full uppercase tracking-wide">
                      Most popular
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                    {plan.name}
                  </p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-numeric text-3xl font-bold text-stone-900">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-sm text-stone-400">{plan.period}</span>
                    )}
                  </div>
                  <p className="text-xs text-stone-400">{plan.description}</p>
                </div>

                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-stone-600">
                      <span className="text-brand-500 font-bold flex-shrink-0 mt-0.5">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  to="/auth"
                  className={`text-center text-sm font-semibold py-2.5 rounded-lg transition-colors ${
                    plan.highlight
                      ? 'bg-brand-600 text-white hover:bg-brand-700'
                      : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-300 hover:bg-stone-50'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-stone-200 py-20">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-stone-900 tracking-tight mb-2">
              Ready to move faster?
            </h2>
            <p className="text-sm text-stone-500">
              Free forever on Starter. No credit card required.
            </p>
          </div>
          <Link
            to="/auth"
            className="flex-shrink-0 bg-brand-600 text-white font-semibold text-sm px-6 py-3 rounded-lg hover:bg-brand-700 transition-colors"
          >
            Get started free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white px-6 py-5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-brand-600 rounded flex items-center justify-center">
              <span className="text-white text-2xs font-bold">PF</span>
            </div>
            <span className="text-sm font-semibold text-stone-400 tracking-tight">Pipeflow</span>
          </div>
          <p className="text-xs text-stone-400">© 2026 Pipeflow. Portfolio project.</p>
        </div>
      </footer>
    </div>
  )
}