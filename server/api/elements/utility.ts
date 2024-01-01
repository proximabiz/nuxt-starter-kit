import type { ZodIssue } from 'zod'

export const AUTH_REQUIRED = false

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

export function returnError(error: string, code?: number) {
  throw createError({
    statusCode: code || 400,
    statusMessage: error || 'Internal server error',
  })
}
