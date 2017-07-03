import { Meteor } from 'meteor/meteor'
import { types } from 'mobx-state-tree'
import Thread from './Thread'

export default types.model('Threads', {
  one: types.maybe(Thread),
  index: types.optional(types.array(Thread), []),
  ref: types.maybe(types.reference(Thread)),
  fetchState: types.optional(types.boolean, false),
  get isEmpty () {
    return this.index.length === 0
  },
  get isNotEmpty () {
    return this.index.length !== 0
  }
}, {
  afterCreate () {
    this.ids = {}
  },
  setIndex (models = []) {
    models.forEach(model => {
      this.ids[model._id] = model
    })
    try {
      this.index = models
    } catch (err) {
      console.info(err)
    }
    this.index = this.index.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },
  setFetchState (state) {
    this.fetchState = state
  },
  find (selector = {}, options = {}) {
    if (!options.limit) {
      options.limit = 50
    }
    this.setFetchState(true)
    return new Promise((resolve, reject) => {
      Meteor.call('threads.find', selector, options, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
        this.setFetchState(false)
      })
    })
  }
})
