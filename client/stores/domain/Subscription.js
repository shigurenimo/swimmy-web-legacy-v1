import { Meteor } from 'meteor/meteor'
import { destroy, types } from 'mobx-state-tree'
import { Mongo } from 'meteor/mongo'

const MethodModel = types.model('MethodModel', {
  name: 'root',
  publish: types.string
}, {
  cursor: null,
  selector: null,
  options: null,
  subscription: null,
  collections: null
}, {
  setFetchState (state) {
    this.fetchState = state
  },
  unsetOne (model) {
    destroy(this.one)
  },
  setcursor (cursor) {
    this.cursor = cursor
  },
  subscribe (selector = {}, options = {}) {
    if (this.cursor) {
      const diff = [
        JSON.stringify(this.selector) === JSON.stringify(selector),
        JSON.stringify(this.options) === JSON.stringify(options)
      ]
      if (diff[0] && diff[1]) return
    }
    this.selector = selector
    this.options = options
    this.unsubscribe()
    const collectionName = this.publish + '.' + this.name
    if (!this.collections) { this.collections = new Map() }
    if (!this.collections.has(collectionName)) {
      this.collections.set(collectionName, new Mongo.Collection(collectionName))
    }
    return new Promise((resolve, reject) => {
      this.subscription = Meteor.subscribe(this.publish, selector, options, this.name, {
        onReady: () => {
          console.info(this.publish + '.subscribe')
          let models = []
          let ref = null
          resolve()
          const cursor = this.collections.get(collectionName).find({})
          .observe({
            added: (model) => {
              models.push(model)
              if (ref !== null) clearTimeout(ref)
              ref = setTimeout(() => {
                this._added(models)
                models = []
                ref = null
              }, 10)
            },
            changed: (model) => {
              this._changed(model)
            },
            removed: (model) => {
              this._removed(model)
            }
          })
          this.setcursor(cursor)
        }
      })
      if (!this.index.length) {
        setTimeout(() => {
          if (!this.index.slice()[0]) {
            const error = new Error('not-found')
            reject(error)
          }
        }, 5000)
      }
    })
  },
  unsubscribe () {
    if (this.cursor) {
      this.cursor.stop()
      this.cursor = null
      this.index = []
    }
    if (this.subscription) {
      this.subscription.stop()
      console.info(this.publish + '.unsubscribe')
    }
  },
  findOne (selector = {}, options = {}) {
    return new Promise((resolve, reject) => {
      Meteor.call(this.publish + '.findOne', selector, options, (err, model) => {
        if (err) { reject(err) } else {
          this._findOne(model)
          resolve(model)
        }
      })
    })
  },
  find (selector = {}, options = {}) {
    return new Promise((resolve, reject) => {
      Meteor.call(this.publish + '.find', selector, options, (err, models) => {
        if (err) { reject(err) } else {
          this._find(models)
          resolve(models)
        }
      })
    })
  },
  insert (req) {
    return new Promise((resolve, reject) => {
      Meteor.call(this.publish + '.insert', req, (err, res) => {
        if (err) { reject(err) } else { resolve(res) }
      })
    })
  },
  remove (modelId) {
    return new Promise((resolve, reject) => {
      Meteor.call(this.publish + '.remove', modelId, (err, res) => {
        if (err) { reject(err) } else { resolve(res) }
      })
    })
  },
  _find (models) {
    if (Array.isArray(models)) {
      this.index = models
    } else {
      this.index = [models]
    }
    this.index = this.index.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },
  _findOne (model) {
    this.one = model
  },
  _added (models) {
    this.addedBefore(models)
    if (Array.isArray(models)) {
      models.forEach(model => {
        try {
          this.index.unshift(model)
        } catch (err) {
          console.info('Subscription.' + this.publish + '._added', err, model)
        }
      })
    } else {
      this.index.push(models)
    }
    this.index = this.index.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    this.addedAfter(models)
  },
  addedBefore () {},
  addedAfter () {},
  _changed (model) {
    this.changedBefore(model)
    const index = this.index.findIndex(item => item._id === model._id)
    if (index !== -1) {
      try {
        this.index[index] = model
      } catch (err) {
        console.info('Subscription.' + this.publish + '._changed', err, model)
      }
    }
    this.changedAfter(model)
  },
  changedBefore () {},
  changedAfter () {},
  _removed (model) {
    this.removedBefore(model)
    const index = this.index.findIndex(item => item._id === model._id)
    this.index.splice(index, 1)
    this.removedAfter(model)
  },
  removedBefore () {},
  removedAfter () {}
})

const IndexModel = types.compose('IndexModel', MethodModel, {
  name: types.identifier(types.optional(types.string, 'root'))
})

const Model = types.compose('Model', MethodModel, {}, {
  afterCreate () {
    this.map = {}
  },
  define (name) {
    if (!name) return
    if (this.map.get(name)) return
    const node = {
      name,
      publish: this.publish
    }
    this.map.set(name, node)
    this[name] = this.map.get(name)
    console.info(this.publish + '.define', name)
  },
  undefine (name) {
    this.map.delete(name)
    delete this[name]
  }
})

const subscribe = (_Model) => {
  const AppIndex = types.compose('Index', IndexModel, {
    one: types.maybe(_Model),
    index: types.optional(types.array(_Model), [])
  })
  const subScribeModel = types.compose('SubModel', Model, {
    map: types.maybe(types.map(AppIndex)),
    one: types.maybe(_Model),
    index: types.optional(types.array(_Model), [])
  })
  return {
    Model: subScribeModel
  }
}

export { IndexModel, Model, subscribe }
