import { CustomError } from '../../utlis/custom.error'
import { protectRoute } from '../../utlis/route.protector'
import { ChartValidation } from '../../utlis/validations'

export default defineEventHandler(async (event) => {
  await protectRoute(event)
  // const client = await serverSupabaseClient(event)
  const params = await readBody(event)

  const chartValidation = await ChartValidation.validateAsync(params)
  if (!chartValidation)
    throw new CustomError('Error: Invalid input provided', 401)
})
