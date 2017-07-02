import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { destroy, types } from 'mobx-state-tree'
import Timeline from './Timeline'

export default types.model('Timelines', {
  index: types.optional(types.array(Timeline), []),
  networkIndex: types.optional(types.array(Timeline), []),
  one: types.maybe(types.reference(Timeline)),
  temp: types.maybe(types.reference(Timeline))
}, {
  afterCreate () {
    this.resetIndex()
    Accounts.onLogin(this.onLogin.bind(this))
    Accounts.onLogout(this.onLogout.bind(this))
  },
  onLogin () {
    this.resetIndex()
  },
  onLogout () {
    this.resetIndex()
  },
  pushIndex (posts) {
    if (!posts) return
    if (Array.isArray(posts)) {
      posts.forEach(post => {
        this.ids[post._id] = post
        this.index.push(post)
      })
    } else {
      this.ids[posts._id] = posts
      this.index.push(posts)
    }
    this.index = this.index.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },
  pullIndex (model) {
    if (typeof model === 'string') {
      const modelId = model
      this.ids[modelId] = null
      this.ref = modelId
      destroy(this.ref)
    } else {
      this.ids[model._id] = null
      this.ref = model._id
      destroy(this.ref)
    }
  },
  spliceIndex (model) {
    this.ids[model._id] = null
    this.ref = model._id
    destroy(this.ref)
  },
  setFromUnique (unique = 'default') {
    this.one = unique
  },
  setFromDate (y, m, d) {
    for (let i = 0, len = this.index.length; i < len; ++i) {
      const one = this.index[i]
      if (one.unique !== 'logs') continue
      this.index[i] = {
        name: y + '.' + m + '.' + d,
        unique: 'logs',
        isStatic: true,
        selector: {
          createdAt: {
            $gte: new Date(y, m - 1, d),
            $lt: new Date(y, m - 1, d + 1)
          }
        },
        options: {},
        other: {y, m, d}
      }
      break
    }
    this.one = 'logs'
  },
  resetIndex () {
    const timeline = {
      name: '全ての書き込み',
      unique: 'default',
      networkId: null,
      isStatic: false,
      selector: {},
      options: {limit: 50}
    }
    const timelines = [timeline]
    if (!this.one) {
      this.one = timeline.unique
    }
    const date = new Date()
    const y = date.getFullYear()
    const m = date.getMonth() + 1
    const d = date.getDate()
    timelines.push({
      name: y + '.' + m + '.' + d,
      unique: 'logs',
      isStatic: true,
      selector: {
        createdAt: {
          $gte: new Date(y, m - 1, d),
          $lt: new Date(y, m - 1, d + 1)
        }
      },
      options: {},
      other: {y, m, d}
    })
    this.networkIndex = []
    const user = Meteor.user()
    if (user) {
      [{
        name: '自分の書き込み',
        unique: 'self',
        networkId: null,
        isStatic: true,
        selector: {
          ownerId: user._id
        },
        options: {
          limit: 50
        }
      }, {
        name: 'ユーザ',
        unique: 'follows',
        networkId: null,
        isStatic: false,
        selector: {
          'owner.username': {$in: user.profile.follows.map(item => item.username)}
        },
        options: {
          limit: 50
        }
      }].forEach(item => {
        timelines.push(item)
      })
      user.profile.networks.forEach(item => {
        this.networkIndex.push({
          name: item.name,
          unique: item._id,
          networkId: item._id,
          isStatic: false,
          selector: {
            networkId: item._id
          },
          options: {
            limit: 50
          }
        })
      })
      if (this.temp) {
        for (let i = 0, len = user.profile.networks.length; i < len; ++i) {
          const network = user.profile.networks[i]
          if (network._id === this.temp.unique) {
            return
          }
        }
        this.networkIndex.push(this.temp)
      }
    }
    this.index = timelines
  },
  setTemp (timeline) {
    this.temp = timeline.unique
  },
  setTempFromNetwork (networkId) {
    this.temp = networkId
  },
  resetTempTimelines () {
    this.temp = null
  }
})
