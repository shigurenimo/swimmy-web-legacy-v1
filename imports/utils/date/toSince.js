export default dateStr => {
  const date = new Date(dateStr)
  const diff = new Date().getTime() - date.getTime()
  const d = new Date(diff)
  if (d.getUTCFullYear() - 1970) {
    return d.getUTCFullYear() - 1970 + '年前'
  } else if (d.getUTCMonth()) {
    return d.getUTCMonth() + 'ヶ月前'
  } else if (d.getUTCDate() - 1) {
    return d.getUTCDate() - 1 + '日前'
  } else if (d.getUTCHours()) {
    return d.getUTCHours() + '時間前'
  } else if (d.getUTCMinutes()) {
    return d.getUTCMinutes() + '分前'
  } else {
    return d.getUTCSeconds() + '秒前'
  }
}
