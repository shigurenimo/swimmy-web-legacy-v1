import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { types } from 'mobx-state-tree'

const Instance = types
.model('Subscription', {
  target: types.string,
  namespace: types.string
})
.actions(self => {
  self.selector = null
  self.options = null
  self.subscription = null
  self.cursor = null
  self.ref = null
  return {
    createCollection (mongoOption) {
      if (!self.ref) {
        const unique = self.target + self.namespace
        if (!mongoOption) {
          mongoOption = {defineMutationMethods: true}
        }
        self.ref = new Mongo.Collection(unique, mongoOption)
      }
      return self.ref
    },
    subscribe (selector, options) {
      self.createCollection()
      return new Promise((resolve, reject) => {
        if (self.subscription) {
          const diff = [
            JSON.stringify(self.selector) === JSON.stringify(selector),
            JSON.stringify(self.options) === JSON.stringify(options)
          ]
          if (diff[0] && diff[1]) {
            reject(new Error())
            return
          }
        }
        self.selector = selector
        self.options = options
        const namespace = self.target + self.namespace
        self.unsubscribe()
        self.subscription = Meteor.subscribe(self.target, selector, options, namespace, {
          onReady: () => {
            console.info('subscribe:' + self.target + '.' + namespace)
            resolve()
          }
        })
      })
    },
    unsubscribe () {
      if (self.cursor) {
        self.cursor.stop()
        self.cursor = null
      }
      if (self.subscription) {
        self.subscription.stop()
        console.info(self.collection + '.unsubscribe')
      }
    },
    observe (callback) {
      if (self.cursor) {
        throw new Error('cursor already exists')
      }
      const cursor = self.ref.find().observe(callback)
      self.cursor = cursor
    },
    observeChanges (callback) {
      if (self.cursor) {
        throw new Error('cursor already exists')
      }
      const cursor = self.ref.find().observeChanges(callback)
      self.cursor = cursor
    }
  }
})

const Observer = types.model('Observer', {
  namespace: 'root',
  target: types.string,
  instance: types.maybe(Instance),
  instanceOne: types.maybe(Instance)
})
.actions(self => {
  return {
    find (selector = {}, options = {}) {
      if (!self.instance) {
        self.instance = {target: self.target, namespace: self.namespace}
      }
      self.setFetchState(true)
      let models = []
      let ref = null
      self.instance.subscribe(selector, options)
      .then(res => {
        self.reset()
        self.instance.observe({
          added: model => {
            models.push(model)
            if (ref !== null) clearTimeout(ref)
            ref = setTimeout(() => {
              self.added(models)
              self.setFetchState(false)
              models = []
              ref = null
            }, 10)
          },
          changed: model => {
            self.changed(model)
          },
          removed: model => {
            self.removed(model)
          }
        })
      })
      .catch(() => {})
    },
    reset () {
      self.index = []
    },
    added (models) {
      self.addedBefore(models)
      if (Array.isArray(models)) {
        models.forEach(model => {
          try {
            self.index.unshift(model)
          } catch (err) {
            console.info('Subscription.' + self.target + '.added', err, model)
          }
        })
      } else {
        self.index.push(models)
      }
      self.addedAfter(models)
    },
    addedBefore () {},
    addedAfter () {
      // self.index = self.index.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    },
    changed (model) {
      const index = self.index.findIndex(item => item._id === model._id)
      if (index !== -1) {
        try {
          self.index[index] = model
        } catch (err) {
          console.info('Subscription.' + self.target + '.changed', err, model)
        }
      }
    },
    removed (model) {
      const index = self.index.findIndex(item => item._id === model._id)
      self.index.splice(index, 1)
    },
    findOne (selector = {}, options = {}) {
      return new Promise((resolve, reject) => {
        if (!self.instanceOne) {
          self.instanceOne = {target: self.target, namespace: 'one'}
        }
        self.instanceOne.subscribe(selector, options)
        .then(res => {
          self.setFetchState(true)
          self.instanceOne.observe({
            added: model => {
              self.setOne(model)
              self.setFetchState(false)
              resolve(model)
            },
            changed: model => {
              self.setOne(model)
            },
            removed: model => {
              self.setOne(null)
            }
          })
        })
        .catch(() => { resolve(self.one) })
        setTimeout(() => {
          if (!self.one) {
            const error = new Error('not-found')
            reject(error)
          }
        }, 5000)
      })
    },
    setOne (model) {
      self.one = model
    },
    setFetchState (state) {
      if (self.fetchState !== state) {
        self.fetchState = state
      }
    }
  }
})

const createModel = (_Model, _Observer) => {
  const Listener = types
  .compose('Listener', _Observer || Observer)
  .props({
    one: types.maybe(_Model),
    index: types.optional(types.array(_Model), [])
  })
  .views(self => {
    return {
      get isEmpty () {
        return self.index.length === 0
      }
    }
  })
  return types
  .model('Observers', {
    target: types.string,
    listener: types.optional(types.map(Listener), {})
  })
  .actions(self => {
    return {
      get (namespace) {
        return self.listener.get(namespace)
      },
      set (namespace) {
        if (!namespace) return
        if (self.listener.get(namespace)) return
        self.listener.set(namespace, {namespace, target: self.target})
        self[namespace] = self.listener.get(namespace)
      },
      unset (name) {
        self.listener.delete(name)
        delete self[name]
      },
      afterCreate () {
        self.set('root')
      }
    }
  })
}

export { Observer, Instance, createModel }
