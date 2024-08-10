import { z } from 'zod'

export const BaseSchema = z.object({
  NUXT_HOST: z.string().optional(),
  NUXT_PORT: z.string().optional(),
})

const PrivateSchema = z.object({
  OPENAI_API_KEY: z.string(),
  SUPABASE_URL: z.string(),
  SUPABASE_KEY: z.string(),
  SENDGRID_API_KEY: z.string(),
  SENDGRID_EMAIL_TEMPLATE_ID: z.string(),
  SENDGRID_FROM_EMAILID: z.string(),
  SITE_KEY: z.string(),
  GOOGLE_CAPTCHA_SECRET_KEY: z.string(),
  APP_URL: z.string().default('http://localhost:3000/'),
  SUPABASE_SERVICE_KEY: z.string(),
  CHARGEBEE_SITE: z.string(),
  CHARGEBEE_API_KEY: z.string(),
  CHARGEBEE_PRODUCT_CATLOG_VERSION: z.string().default('v2'),
  CHARGEBEE_GATEWAY_ACCOUNT_ID: z.string(),
})

export const Env = BaseSchema.merge(PrivateSchema)
