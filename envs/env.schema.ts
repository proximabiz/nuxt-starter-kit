import { z } from 'zod'

export const BaseSchema = z.object({
  NUXT_HOST: z.string().optional(),
  NUXT_PORT: z.string().optional(),
})

const PublicSchema = z.object({
  // EXAMPLE_PUBLIC: z.string(),
  SUPABASE_URL: z.string(),
  SUPABASE_KEY: z.string(),
})

const PrivateSchema = z.object({
  OPENAI_API_KEY: z.string(),
})

export const Env = BaseSchema.merge(PublicSchema).merge(PrivateSchema)
