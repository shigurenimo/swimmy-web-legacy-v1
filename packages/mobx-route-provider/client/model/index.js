import { types } from 'mobx-state-tree'
import page from 'page'

export default types.model('routers', {
  page: types.maybe(types.string),
  pageCache: types.maybe(types.string),
  path: types.maybe(types.string),
  scrollCache: types.optional(types.number, 0)
}, {
  params: null,
  auery: null
}, {
  setRoute (page) {
    this.pageCache = this.page
    this.page = page
  },
  setPath (path) {
    this.path = path
  },
  setParams (params) {
    this.params = params
  },
  setQuery (query) {
    this.query = query
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
})
