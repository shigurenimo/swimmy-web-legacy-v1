export default str => {
  const pattern = /((h?)(ttps?:\/\/[a-zA-Z0-9.\-_@:/~?%&;=+#',()*!]+))/g // ']))/
  const list = str.match(pattern)
  return list ? list[0] : ''
}
