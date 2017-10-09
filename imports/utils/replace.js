function replaceLink (str) {
  const pattern = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g // ']))/
  return str.replace(pattern, (all, url, h, href) => {
    return `<a href='${h + href}' target='_blank'>${url}</a>`
  })
}

function matchTags (str) {
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
  const tags = matches
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

function replaceTags (str) {
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

function matchUrl (str) {
  const pattern = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g // ']))/
  const list = str.match(pattern)
  return list ? list[0] : ''
}

const match = {tags: matchTags, url: matchUrl}

const replace = {link: replaceLink, tags: replaceTags}

export { match, replace }
