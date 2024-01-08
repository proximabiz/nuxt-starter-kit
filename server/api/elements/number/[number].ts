import { z } from 'zod'
import { elements } from '~/server/api/elements/database'
import { AUTH_REQUIRED, returnError, returnUnauthorized, validateParams } from '~/server/api/elements/utility'

const paramsSchema = z.object({
  number: z.string(),
})

export default defineEventHandler((event) => {
  if (AUTH_REQUIRED)
    return returnUnauthorized()

  const number = getRouterParam(event, 'number')

  const validationResult = paramsSchema.safeParse({ number })

  if (!validationResult.success)
    return validateParams(validationResult.error.issues)

  const element = elements.find(e => e.number.toString() === validationResult.data.number.toString())
  if (!element)
    returnError('Element not found')

  return element
})
