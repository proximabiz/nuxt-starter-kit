import { z } from 'zod'
import db from './elements.json'
import { returnUnauthorized, validateParams } from './utility'

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
