import { Env } from '~/env.schema'
import { logger } from '~/utility/logger'

export default defineNuxtPlugin((_nuxtApp) => {
  try {
    const envs = process.env as object
    const validation = Env.safeParse(envs)
    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        logger.warn(`\x1B[33m ⚠️  Missing env ${issue.path.join('.')} ${issue.message}\x1B[0m`)
      })
    }
  }
  catch (error) {
    logger.error('Error parsing env', error)
  }
})
