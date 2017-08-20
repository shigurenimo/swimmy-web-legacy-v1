export default (date) => {
  return [
    date.getUTCFullYear(),
    ('00' + (date.getUTCMonth() + 1)).slice(-2),
    ('00' + date.getUTCDate()).slice(-2)
  ].join('/') + '/'
}
