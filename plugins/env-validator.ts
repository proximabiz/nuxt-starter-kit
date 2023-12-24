import process from 'node:process'
import { Env } from '~/env.schema'

export default defineNuxtPlugin((_nuxtApp) => {
  let ENV_FILE = {}
  try {
    if (process.env.ENV_FILE)
      ENV_FILE = JSON.parse(process.env.ENV_FILE)
  }
  catch (error) {
    console.error('Error parsing ENV_FILE:', error)
  }

  const validation = Env.safeParse(ENV_FILE)
  if (!validation.success) {
    validation.error.issues.forEach((issue) => {
      console.error(`\x1B[31m⚠️  Missing env ${issue.path.join('.')} ${issue.message}\x1B[0m`)
    })
  }
})
