import { AUTH_REQUIRED, returnError, returnUnauthorized } from '~/server/api/elements/utility'

export default defineEventHandler(() => {
  if (AUTH_REQUIRED)
    return returnUnauthorized()

  return returnError('Name parameter is required')
})
