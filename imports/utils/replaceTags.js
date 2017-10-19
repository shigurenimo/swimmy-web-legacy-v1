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
  return str.replace(pattern, (tag, name) => {
    return `<a href='/?tag=${name}'>${tag}</a>`
  })
}
