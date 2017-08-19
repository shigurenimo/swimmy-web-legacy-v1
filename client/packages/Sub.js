import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'
import { types } from 'mobx-state-tree'

const Instance = types.model('Subscription', {
  target: types.string,
  namespace: types.string
}, {
  selector: null,
  options: null,
  subscription: null,
  cursor: null,
  ref: null
}, {
  createCollection (mongoOption) {
    if (!this.ref) {
      const unique = this.target + this.namespace
      if (!mongoOption) {
        mongoOption = {defineMutationMethods: true}
      }
      this.ref = new Mongo.Collection(unique, mongoOption)
    }
    return this.ref
  },
  subscribe (selector, options) {
    this.createCollection()
    return new Promise((resolve, reject) => {
      if (this.subscription) {
        const diff = [
          JSON.stringify(this.selector) === JSON.stringify(selector),
          JSON.stringify(this.options) === JSON.stringify(options)
        ]
        if (diff[0] && diff[1]) {
          reject(new Error())
          return
        }
      }
      this.selector = selector
      this.options = options
      const namespace = this.target + this.namespace
      this.unsubscribe()
      this.subscription = Meteor.subscribe(this.target, selector, options, namespace, {
        onReady: () => {
          console.info('subscribe:' + this.target + '.' + namespace)
          resolve()
        }
      })
    })
  },
  unsubscribe () {
    if (this.cursor) {
      this.cursor.stop()
      this.cursor = null
    }
    if (this.subscription) {
      this.subscription.stop()
      console.info(this.collection + '.unsubscribe')
    }
  },
  observe (callback) {
    if (this.cursor) {
      throw new Error('cursor already exists')
    }
    const cursor = this.ref.find().observe(callback)
    this.cursor = cursor
  },
  observeChanges (callback) {
    if (this.cursor) {
      throw new Error('cursor already exists')
    }
    const cursor = this.ref.find().observeChanges(callback)
    this.cursor = cursor
  }
})

const Observer = types.model('Observer', {
  namespace: 'root',
  target: types.string,
  instance: types.maybe(Instance),
  instanceOne: types.maybe(Instance)
}, {
  find (selector = {}, options = {}) {
    if (!this.instance) {
      this.instance = {target: this.target, namespace: this.namespace}
    }
    this.setFetchState(true)
    let models = []
    let ref = null
    this.instance.subscribe(selector, options)
    .then(res => {
      this.reset()
      this.instance.observe({
        added: model => {
          models.push(model)
          if (ref !== null) clearTimeout(ref)
          ref = setTimeout(() => {
            this.added(models)
            this.setFetchState(false)
            models = []
            ref = null
          }, 10)
        },
        changed: model => {
          this.changed(model)
        },
        removed: model => {
          this.removed(model)
        }
      })
    })
    .catch(() => {})
  },
  reset () {
    this.index = []
  },
  added (models) {
    this.addedBefore(models)
    if (Array.isArray(models)) {
      models.forEach(model => {
        try {
          this.index.unshift(model)
        } catch (err) {
          console.info('Subscription.' + this.target + '.added', err, model)
        }
      })
    } else {
      this.index.push(models)
    }
    this.addedAfter(models)
  },
  addedBefore () {},
  addedAfter () {
    this.index = this.index.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  },
  changed (model) {
    const index = this.index.findIndex(item => item._id === model._id)
    if (index !== -1) {
      try {
        this.index[index] = model
      } catch (err) {
        console.info('Subscription.' + this.target + '.changed', err, model)
      }
    }
  },
  removed (model) {
    const index = this.index.findIndex(item => item._id === model._id)
    this.index.splice(index, 1)
  },
  findOne (selector = {}, options = {}) {
    return new Promise((resolve, reject) => {
      if (!this.instanceOne) {
        this.instanceOne = {target: this.target, namespace: 'one'}
      }
      this.instanceOne.subscribe(selector, options)
      .then(res => {
        this.setFetchState(true)
        this.instanceOne.observe({
          added: model => {
            this.setOne(model)
            this.setFetchState(false)
            resolve(model)
          },
          changed: model => {
            this.setOne(model)
          },
          removed: model => {
            this.setOne(null)
          }
        })
      })
      .catch(() => { resolve(this.one) })
      setTimeout(() => {
        if (!this.one) {
          const error = new Error('not-found')
          reject(error)
        }
      }, 5000)
    })
  },
  setOne (model) {
    this.one = model
  },
  setFetchState (state) {
    if (this.fetchState !== state) {
      this.fetchState = state
    }
    console.log(this.fetchState)
  }
})

const Subject = types.model('Subject', {
  target: types.string
}, {
  get (namespace) {
    return this.listener.get(namespace)
  },
  set (namespace) {
    if (!namespace) return
    if (this.listener.get(namespace)) return
    this.listener.set(namespace, {namespace, target: this.target})
    this[namespace] = this.listener.get(namespace)
  },
  unset (name) {
    this.listener.delete(name)
    delete this[name]
  },
  afterCreate () {
    this.set('root')
  }
})

const createModel = (_Model, _Observer) => {
  const Listener = types.compose('Listener', (_Observer || Observer), {
    one: types.maybe(_Model),
    index: types.optional(types.array(_Model), []),
    get isEmpty () { return this.index.length === 0 }
  })
  return types.compose('Observers', Subject, {
    listener: types.optional(types.map(Listener), {})
  })
}

export { Observer, Instance, createModel }
