import { Env } from '../env.schema'
import { logger } from './logger'

export default function validateEnvs() {
  try {
    const envs = { ...process.env }
    const validation = Env.safeParse(envs)
    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        logger.warn(`⚠️ Missing env ${issue.path.join('.')} ${issue.message}`)
      })
    }
  }
  catch (error) {
    logger.error('Error during environment variable validation:', error)
  }
}
