import { z } from 'zod'
import db from '~/server/api/elements/elements.json'
import { AUTH_REQUIRED, returnError, returnUnauthorized, validateParams } from '~/server/api/elements/utility'

const paramsSchema = z.object({
  name: z.string(),
})

export default defineEventHandler((event) => {
  if (AUTH_REQUIRED)
    return returnUnauthorized()

  const name = getRouterParam(event, 'name')

  const validationResult = paramsSchema.safeParse({ name })

  if (!validationResult.success)
    return validateParams(validationResult.error.issues)

  const element = db.elements.find(e => e.name.toLowerCase() === validationResult.data.name.toLowerCase())
  if (!element)
    returnError('Element not found')

  return element
})
