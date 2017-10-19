export default str => {
  const pattern = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g // ']))/
  return str.replace(pattern, (all, url, h, href) => {
    return `<a href='${h + href}' target='_blank'>${url}</a>`
  })
}
