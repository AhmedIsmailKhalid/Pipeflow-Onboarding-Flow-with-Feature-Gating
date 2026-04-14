import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { OnboardingContext, OnboardingEvent } from '@/machines/onboarding.types'
import { cn } from '@/lib/utils'

const TOUR_SLIDES = [
  { title: 'Organise with Projects',   description: 'Break work into projects and tasks. Assign owners, set due dates, and track progress all in one place.', icon: '📋', bg: 'bg-brand-50 border-brand-100' },
  { title: 'Collaborate in Real Time', description: 'Comment on tasks, mention teammates, and get notified the moment something changes.', icon: '💬', bg: 'bg-violet-50 border-violet-100' },
  { title: 'Track with Analytics',     description: 'See velocity, completion rates, and bottlenecks at a glance. Know exactly where your team stands.', icon: '📊', bg: 'bg-emerald-50 border-emerald-100' },
  { title: 'Automate the Routine',     description: 'Set up rules to move tasks, send reminders, and update statuses automatically.', icon: '⚡', bg: 'bg-amber-50 border-amber-100' },
]

interface Step4Props {
  send: (event: OnboardingEvent) => void
  context: OnboardingContext
}

export function Step4Tour({ send, context: _context }: Step4Props) {
  const [activeSlide, setActiveSlide] = useState(0)
  const isLastSlide = activeSlide === TOUR_SLIDES.length - 1
  const slide = TOUR_SLIDES[activeSlide]

  function handleNext() {
    if (!isLastSlide) { setActiveSlide((p) => p + 1); return }
    send({ type: 'NEXT', answers: { step4: { tourComplete: true } } })
  }

  return (
    <div className="bg-white border border-rust-200 rounded-xl p-8 shadow-card">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-rust-900 tracking-tight">See what Pipeflow can do</h1>
        <p className="text-rust-500 mt-2 text-sm">A quick look at the features that'll help your team move faster.</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className={cn('rounded-xl p-6 mb-6 border', slide.bg)}
        >
          <div className="text-4xl mb-4">{slide.icon}</div>
          <h2 className="text-base font-semibold text-rust-900 mb-2">{slide.title}</h2>
          <p className="text-sm text-rust-500 leading-relaxed">{slide.description}</p>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-1.5 mb-6">
        {TOUR_SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveSlide(index)}
            className={cn(
              'rounded-full transition-all duration-200',
              index === activeSlide ? 'w-6 h-2 bg-brand-500' : 'w-2 h-2 bg-rust-200 hover:bg-rust-300'
            )}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="secondary" size="lg" className="flex-1" onClick={() => send({ type: 'BACK' })}>Back</Button>
        <Button type="button" size="lg" className="flex-1 bg-brand-600 hover:bg-brand-700" onClick={handleNext}>
          {isLastSlide ? 'Finish Tour' : 'Next'}
        </Button>
      </div>
    </div>
  )
}