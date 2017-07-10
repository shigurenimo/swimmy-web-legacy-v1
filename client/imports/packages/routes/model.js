import { types } from 'mobx-state-tree'
import page from 'page'

export default types.model('Routes', {
  page: '',
  template: '',
  pageCache: '',
  scrollCache: 0,
  go (href) {
    page(href)
  },
  stop () {
    page.stop()
  },
  start () {
    page.start()
  },
  redirect () {
    page.redirect(...arguments)
  }
}, {
  setRoute (page) {
    this.pageCache = this.page
    this.page = page
  },
  setTemplate (template) {
    this.template = template
  }
})
