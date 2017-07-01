import page from 'page'

export default {
  setRoute (page) {
    this.pageCache = this.page
    this.page = page
  },
  go (href) {
    page(href)
  },
  stop () {
    page.stop()
  },
  start () {
    page.start()
  }
}
