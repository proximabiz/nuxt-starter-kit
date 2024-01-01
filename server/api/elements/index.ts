import { z } from 'zod'
import { filter as elementFilter } from 'lodash-es'
import db from './elements.json'
import { AUTH_REQUIRED, returnUnauthorized, validateParams } from '~/server/api/elements/utility'

const validAtomicNumbers = db.elements.map(e => e.number.toString()) as [string, ...string[]]
const validNames = db.elements.map(e => e.name) as [string, ...string[]]
const atomicNumberEnum = z.enum(validAtomicNumbers)
const atomicNameEnum = z.enum(validNames)

const QueryParamsSchema = z.object({
  number: atomicNumberEnum.optional(),
  name: atomicNameEnum.optional(),
})

export default defineEventHandler(async (event) => {
  if (AUTH_REQUIRED)
    return returnUnauthorized()

  const query = getQuery(event)
  const validationResult = QueryParamsSchema.safeParse(query)

  if (!validationResult.success)
    return validateParams(validationResult.error.issues)

  const el = elementFilter(db.elements, (element) => {
    const matchesAtomicNumber = validationResult.data.number ? element.number.toString() === validationResult.data.number : true
    const matchesAtomicName = validationResult.data.name ? element.name === validationResult.data.name : true
    return matchesAtomicNumber && matchesAtomicName
  })
  return el
})
