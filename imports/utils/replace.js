function matchUrl (str) {
  const pattern = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g // ']))/
  const list = str.match(pattern)
  return list ? list[0] : ''
}

const match = {tags: matchTags, url: matchUrl}

const replace = {link: replaceLink, tags: replaceTags}

export { match, replace }
