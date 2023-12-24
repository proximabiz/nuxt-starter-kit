import { Env } from '~/env.schema'
import { logger } from '~/utility/logger'

export default defineNuxtPlugin((_nuxtApp) => {
  let ENV_FILE = {}
  try {
    if (process.env.ENV_FILE)
      ENV_FILE = JSON.parse(process.env.ENV_FILE)
  }
  catch (error) {
    logger.error('Error parsing ENV_FILE:', error)
  }

  const validation = Env.safeParse(ENV_FILE)
  if (!validation.success) {
    validation.error.issues.forEach((issue) => {
      logger.warn(`\x1B[33m ⚠️  Missing env ${issue.path.join('.')} ${issue.message}\x1B[0m`)
    })
  }
})
