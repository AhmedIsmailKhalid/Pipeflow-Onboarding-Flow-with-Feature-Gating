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
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-4">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <div className="w-7 h-7 bg-brand-600 rounded flex items-center justify-center">
          <span className="text-white text-xs font-bold">PF</span>
        </div>
        <span className="text-lg font-semibold text-rust-900 tracking-tight">Pipeflow</span>
      </Link>

      <div className="bg-white border border-rust-200 rounded-xl w-full max-w-md shadow-card overflow-hidden">
        <div className="flex border-b border-rust-100">
          {(
            [
              { id: 'signup', label: 'Create account' },
              { id: 'login',  label: 'Sign in' },
            ] as { id: Tab; label: string }[]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 py-3.5 text-sm font-medium transition-colors relative',
                activeTab === tab.id ? 'text-rust-900' : 'text-rust-400 hover:text-rust-600'
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="auth-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600"
                />
              )}
            </button>
          ))}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {activeTab === 'signup' ? <SignUpForm /> : <LoginForm />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <p className="text-xs text-rust-400 mt-5 text-center">
        By continuing, you agree to our{' '}
        <span className="text-rust-500 hover:text-rust-700 cursor-pointer transition-colors underline underline-offset-2">Terms</span>
        {' '}and{' '}
        <span className="text-rust-500 hover:text-rust-700 cursor-pointer transition-colors underline underline-offset-2">Privacy Policy</span>
      </p>
    </div>
  )
}