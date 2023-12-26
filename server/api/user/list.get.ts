export default defineEventHandler(async () => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    return response.json()
  }
  catch (error) {
    let errorMessage = 'Failed to fetch users'
    if (error instanceof Error)
      errorMessage = error.message

    throw createError({
      statusCode: 400,
      statusMessage: errorMessage,
    })
  }
})
