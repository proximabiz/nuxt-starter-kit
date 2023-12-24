import { z } from 'zod'
import { BaseSchema } from './utility/env.validator'

const PublicSchema = z.object({
  EXAMPLE_PUBLIC: z.string(),
})

const PrivateSchema = z.object({
  EXAMPLE_SECRET: z.string(),
})

export const Env = BaseSchema.merge(PublicSchema).merge(PrivateSchema)
