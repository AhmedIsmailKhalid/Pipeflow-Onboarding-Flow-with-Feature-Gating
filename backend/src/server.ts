import 'dotenv/config'
import { createApp } from './app'
import { logger } from './lib/logger'
import { prisma } from './lib/prisma'

const PORT = Number(process.env.PORT ?? 3001)

async function start() {
  try {
    await prisma.$connect()
    logger.info('Database connected')

    const app = createApp()

    app.listen(PORT, () => {
      logger.info(`Pipeflow API running`, { port: PORT, env: process.env.NODE_ENV ?? 'development' })
    })
  } catch (err) {
    logger.error('Failed to start server', { err })
    process.exit(1)
  }
}

start()