import type { ZodIssue } from 'zod'
import { z } from 'zod'
import db from './elements.json'

const validAtomicNumbers = db.elements.map(e => e.number.toString()) as [string, ...string[]]
const validNames = db.elements.map(e => e.name) as [string, ...string[]]
const atomicNumberEnum = z.enum(validAtomicNumbers)
const atomicNameEnum = z.enum(validNames)

const QueryParamsSchema = z.object({
  number: atomicNumberEnum.optional(),
  name: atomicNameEnum.optional(),
})

const AUTH_REQUIRED = false
export default defineEventHandler(async (event) => {
  if (AUTH_REQUIRED)
    return returnUnauthorized()

  const query = getQuery(event)
  const validationResult = QueryParamsSchema.safeParse(query)

  if (!validationResult.success)
    return validateParams(validationResult.error.issues)

  return db.elements
})

export function returnUnauthorized() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: 'Unauthorized',
      })
    }, 1000)
  })
}

export function validateParams(errors: ZodIssue[], message?: string) {
  throw createError({
    statusCode: 400,
    statusMessage: message || 'Invalid request',
    data: errors,
  })
}
