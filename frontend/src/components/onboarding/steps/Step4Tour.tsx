import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { OnboardingContext, OnboardingEvent } from '@/machines/onboarding.types'
import { cn } from '@/lib/utils'

interface TourSlide {
  title: string
  description: string
  icon: string
  color: string
}

const TOUR_SLIDES: TourSlide[] = [
  {
    title: 'Organise with Projects',
    description:
      'Break work into projects and tasks. Assign owners, set due dates, and track progress all in one place.',
    icon: '📋',
    color: 'from-blue-50 to-indigo-50',
  },
  {
    title: 'Collaborate in Real Time',
    description:
      'Comment on tasks, mention teammates, and get notified the moment something changes. No more status meetings.',
    icon: '💬',
    color: 'from-purple-50 to-pink-50',
  },
  {
    title: 'Track with Analytics',
    description:
      'See velocity, completion rates, and bottlenecks at a glance. Know exactly where your team stands.',
    icon: '📊',
    color: 'from-green-50 to-emerald-50',
  },
  {
    title: 'Automate the Routine',
    description:
      'Set up rules to move tasks, send reminders, and update statuses automatically. Focus on the work that matters.',
    icon: '⚡',
    color: 'from-amber-50 to-orange-50',
  },
]

interface Step4Props {
  send: (event: OnboardingEvent) => void
  context: OnboardingContext
}

export function Step4Tour({ send, context: _context }: Step4Props) {
  const [activeSlide, setActiveSlide] = useState(0)
  const isLastSlide = activeSlide === TOUR_SLIDES.length - 1

  function handleNext() {
    if (!isLastSlide) {
      setActiveSlide((prev) => prev + 1)
      return
    }
    send({ type: 'NEXT', answers: { step4: { tourComplete: true } } })
  }

  const slide = TOUR_SLIDES[activeSlide]

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          See what Pipeflow can do
        </h1>
        <p className="text-slate-500 mt-2 text-sm">
          A quick look at the features that'll help your team move faster.
        </p>
      </div>

      {/* Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSlide}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={cn(
            'rounded-xl p-6 mb-6 bg-gradient-to-br',
            slide.color
          )}
        >
          <div className="text-4xl mb-4">{slide.icon}</div>
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            {slide.title}
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {slide.description}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Slide dots */}
      <div className="flex items-center justify-center gap-1.5 mb-6">
        {TOUR_SLIDES.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => setActiveSlide(index)}
            className={cn(
              'rounded-full transition-all duration-200',
              index === activeSlide
                ? 'w-6 h-2 bg-brand-500'
                : 'w-2 h-2 bg-slate-200 hover:bg-slate-300'
            )}
          />
        ))}
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="secondary"
          size="lg"
          className="flex-1"
          onClick={() => send({ type: 'BACK' })}
        >
          Back
        </Button>
        <Button
          type="button"
          size="lg"
          className="flex-1"
          onClick={handleNext}
        >
          {isLastSlide ? 'Finish Tour' : 'Next'}
        </Button>
      </div>
    </div>
  )
}