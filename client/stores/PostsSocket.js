import { Meteor } from 'meteor/meteor'
import { toJS } from 'mobx'
import { destroy, types } from 'mobx-state-tree'
import collections from '/collections'
import Post from './Post'

export default types.model('SocketPosts', {
  one: types.maybe(Post),
  index: types.optional(types.array(Post), []),
  ref: types.maybe(types.reference(Post)),
  isFetching: false
}, {
  afterCreate () {
    this.ids = {}
    this.cursor = null
    this.selector = null
    this.options = null
    this.uniqueCache = null
    this.subscription = null
  },
  pushIndex (models) {
    if (Array.isArray(models)) {
      models.forEach(model => {
        this.ids[model._id] = model
        this.index.push(model)
      })
    } else {
      const model = models
      this.ids[model._id] = model
      this.index.push(model)
    }
    this.index = this.index.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
  },
  replaceIndex (model) {
    this.ids[model._id] = model
    this.ref = model._id
    this.ref = model
  },
  spliceIndex (model) {
    this.ids[model._id] = null
    this.ref = model._id
    destroy(this.ref)
  },
  setFetchState (state) {
    this.isFetching = state
  },
  subscribe (timeline) {
    const {selector, options} = toJS(timeline)
    if (this.cursor) {
      const equal = {
        selector: JSON.stringify(this.selector) === JSON.stringify(selector),
        options: JSON.stringify(this.options) === JSON.stringify(options)
      }
      if (equal.selector && equal.options) return
    }
    this.selector = selector
    this.options = options
    this.unsubscribe()
    setTimeout(() => {
      this.setFetchState(false)
    }, 5000)
    this.subscription = Meteor.subscribe('posts', selector, options, {
      onReady: () => {
        let task = false
        let stocks = []
        this.cursor = collections.posts.find().observe({
          addedAt: (res) => {
            stocks.push(res)
            if (task !== false) clearTimeout(task)
            task = setTimeout(() => {
              this.pushIndex(stocks)
              this.setFetchState(false)
              task = null
              stocks = []
            }, 10)
          },
          changed (model) {
            this.replaceIndex(model)
          },
          removed (model) {
            this.spliceIndex(model)
          }
        })
      }
    })
  },
  unsubscribe () {
    if (this.cursor) {
      this.cursor.stop()
      this.cursor = null
      this.ids = {}
      this.index = []
    }
    if (this.subscription) {
      this.subscription.stop()
    }
  }
})
