export function formatTimestampToDate(timestamp: number, returnYearOnly = false) {
  // Convert the timestamp to milliseconds by multiplying by 1000
  const date = new Date(timestamp * 1000)

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, '0') // Pad single digit days with a leading zero
  const month = String(date.getMonth() + 1).padStart(2, '0') // Months are zero-indexed, so add 1
  const year = date.getFullYear()

  // Return only the year if specified
  if (returnYearOnly)
    return year.toString()

  // Combine into 'dd/mm/yyyy' format
  return `${day}/${month}/${year}`
}
