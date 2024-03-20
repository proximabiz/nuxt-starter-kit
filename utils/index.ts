interface QueryParams {
  [key: string]: string
}

export function getAppURL() {
  const config = useRuntimeConfig()
  return config.public.APP_URL
}

export function buildURL(path: string, query?: QueryParams) {
  let url = getAppURL() + path

  if (query) {
    const queryString = Object.keys(query)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(query[key]))}`)
      .join('&')
    url += `?${queryString}`
  }

  return url
}

export function maskEmail(email: string) {
  const atIndex = email.lastIndexOf('@')
  if (atIndex !== -1) {
    const username = email.substring(0, atIndex)
    const maskedUsername = `${username.slice(0, -3)}***`
    const domain = email.substring(atIndex)
    return maskedUsername + domain
  }
  else {
    // Handle invalid email addresses without '@'
    return email
  }
}
