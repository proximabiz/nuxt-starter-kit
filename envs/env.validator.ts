import { Env } from './env.schema'

export default function validateEnvs() {
  try {
    const envs = { ...process.env }
    const validation = Env.safeParse(envs)
    if (!validation.success) {
      validation.error.issues.forEach((issue) => {
        console.warn(`Missing env ${issue.path.join('.')} ${issue.message}`)
      })
      process.exit(1)
    }
    console.info('Loaded environment variables')
  }
  catch (error) {
    console.error('Unable to parse .env. validation error:', error)
  }
}
