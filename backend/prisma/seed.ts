import { PrismaClient, Plan } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const SALT_ROUNDS = 12
const DEMO_PASSWORD = 'Demo1234!'

interface SeedUser {
  email: string
  name: string
  plan: Plan
  onboardingComplete: boolean
  completedSteps: number[]
  stepAnswers: Record<string, unknown>
  lastActiveStep: number
}

const SEED_USERS: SeedUser[] = [
  {
    email: 'starter@demo.com',
    name: 'Alex Chen',
    plan: Plan.STARTER,
    onboardingComplete: false,
    completedSteps: [],
    stepAnswers: {},
    lastActiveStep: 1,
  },
  {
    email: 'growth@demo.com',
    name: 'Jordan Rivera',
    plan: Plan.GROWTH,
    onboardingComplete: false,
    completedSteps: [1, 2, 3],
    stepAnswers: {
      step1: {
        role: 'Product Manager',
        teamSize: '11-50',
        useCase: 'Product',
      },
      step2: {
        workspaceName: 'Rivera Co',
        inviteEmails: ['teammate@demo.com'],
      },
      step3: {
        connectedIntegrations: ['slack', 'github'],
      },
    },
    lastActiveStep: 4,
  },
  {
    email: 'scale@demo.com',
    name: 'Sam Patel',
    plan: Plan.SCALE,
    onboardingComplete: true,
    completedSteps: [1, 2, 3, 4],
    stepAnswers: {
      step1: {
        role: 'Solo Founder',
        teamSize: '50+',
        useCase: 'Operations',
      },
      step2: {
        workspaceName: 'Patel Ventures',
        inviteEmails: ['alice@demo.com', 'bob@demo.com'],
      },
      step3: {
        connectedIntegrations: ['slack', 'github', 'notion', 'jira'],
      },
      step4: {
        tourComplete: true,
      },
    },
    lastActiveStep: 5,
  },
]

async function main() {
  console.log('🌱 Seeding database...')

  // Wipe all data first — cascades handle onboarding_progress and plan_upgrades
  await prisma.planUpgrade.deleteMany()
  await prisma.onboardingProgress.deleteMany()
  await prisma.user.deleteMany()
  console.log('  🗑️  Cleared existing data')

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, SALT_ROUNDS)

  for (const seedUser of SEED_USERS) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stepAnswers = seedUser.stepAnswers as any

    const user = await prisma.user.create({
      data: {
        email: seedUser.email,
        passwordHash,
        name: seedUser.name,
        plan: seedUser.plan,
        onboardingComplete: seedUser.onboardingComplete,
      },
    })

    await prisma.onboardingProgress.create({
      data: {
        userId: user.id,
        completedSteps: seedUser.completedSteps,
        stepAnswers,
        lastActiveStep: seedUser.lastActiveStep,
      },
    })

    console.log(`  ✅ ${seedUser.email} (${seedUser.plan})`)
  }

  console.log('\n✅ Seed complete.')
  console.log('\nDemo accounts:')
  console.log('  starter@demo.com  — Starter plan, step 1 complete, on step 2')
  console.log('  growth@demo.com   — Growth plan, steps 1–3 complete, on step 4')
  console.log('  scale@demo.com    — Scale plan, onboarding fully complete')
  console.log(`  Password for all: ${DEMO_PASSWORD}`)
}

main()
  .catch((err) => {
    console.error('Seed failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })