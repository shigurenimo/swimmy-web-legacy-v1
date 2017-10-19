export default str => {
  const hash = '#'
  const tag = 'A-Za-z〃々ぁ-ゖ゛-ゞァ-ヺーヽヾ一-龥Ａ-Ｚａ-ｚｦ-ﾟ'
  const digit = '0-9０-９'
  const underscore = '_'
  const pattern = new RegExp(
    '[' + hash + ']' +
    '(' +
    '[' + tag + digit + underscore + ']*' +
    '[' + tag + ']+' +
    '[' + tag + digit + underscore + ']*' +
    ')' +
    '(?![' + hash + tag + digit + underscore + ']+)',
    'g')
  const matches = str.match(pattern) || []
  const cacheTags = []
  const tags = matche
  .filter((tag, i) => i < 3)
  .map(item => {
    return item
    .replace(/\s+/g, '')
    .replace('#', '')
  })
  .filter(item => item)
  .filter(item => String(item))
  .filter(item => {
    const check = !cacheTags.includes(item)
    cacheTags.push(item)
    return check
  })
  return tags
}
