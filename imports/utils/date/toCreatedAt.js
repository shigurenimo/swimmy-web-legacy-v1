export default dateStr => {
  const d = new Date(dateStr)
  const year = d.getUTCFullYear()
  const month = d.getUTCMonth() + 1
  const day = d.getUTCDate()
  return [year, month, day].join('.')
}
