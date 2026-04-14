import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { SignUpForm } from '@/components/auth/SignUpForm'
import { LoginForm } from '@/components/auth/LoginForm'
import { cn } from '@/lib/utils'

type Tab = 'signup' | 'login'

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<Tab>('signup')

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-brand-50 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-sm font-bold">P</span>
        </div>
        <span className="text-xl font-bold text-slate-900">Pipeflow</span>
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 w-full max-w-md overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          {(
            [
              { id: 'signup', label: 'Create account' },
              { id: 'login', label: 'Sign in' },
            ] as { id: Tab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 py-4 text-sm font-medium transition-colors relative',
                activeTab === tab.id
                  ? 'text-brand-600'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="auth-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-500"
                />
              )}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'signup' ? <SignUpForm /> : <LoginForm />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}