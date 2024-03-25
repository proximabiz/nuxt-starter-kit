import { z } from 'zod'

export const BaseSchema = z.object({
  NUXT_HOST: z.string().optional(),
  NUXT_PORT: z.string().optional(),
})

const PrivateSchema = z.object({
  OPENAI_API_KEY: z.string(),
  NUXT_PUBLIC_SUPABASE_URL: z.string(),
  NUXT_PUBLIC_SUPABASE_KEY: z.string(),
  SENDGRID_API_KEY: z.string(),
  SENDGRID_EMAIL_TEMPLATE_ID: z.string(),
  SENDGRID_FROM_EMAILID: z.string(),
  SITE_KEY: z.string(),
  GOOGLE_CAPTCHA_SECRET_KEY: z.string(),
  APP_URL: z.string().default('http://localhost:3000/'),
})

export const Env = BaseSchema.merge(PrivateSchema)
