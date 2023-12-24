import { z } from 'zod'
import { Env } from '../env.schema'
import { logger } from './logger'

export const BaseSchema = z.object({
  NUXT_HOST: z.string().optional(),
  NUXT_PORT: z.string().optional(),
})

export default function validateEnvs() {
  try {
    const envs = { ...process.env }
    const validation = Env.safeParse(envs)
    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        logger.warn(`Missing env ${issue.path.join('.')} ${issue.message}`)
      })
      process.exit(1)
    }
    logger.info('Loaded environment variables')
  }
  catch (error) {
    logger.error('Unable to parse .env. validation error:', error)
  }
}
