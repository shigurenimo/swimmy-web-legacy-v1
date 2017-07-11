import { Meteor } from 'meteor/meteor'
import { destroy, types } from 'mobx-state-tree'
import Timeline from './Timeline'

export default types.model('Timelines', {
  index: types.optional(types.array(Timeline), []),
  channelIndex: types.optional(types.array(Timeline), []),
  one: types.maybe(types.reference(Timeline)),
  temp: types.maybe(types.reference(Timeline)),
  name: types.maybe(types.string),
  channelId: types.maybe(types.string),
  useSocket: types.maybe(types.boolean),
  unique: types.maybe(types.string)
}, {
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
      channelId: null,
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
    this.channelIndex = []
    const user = Meteor.user()
    if (user) {
      [{
        name: '自分の書き込み',
        unique: 'self',
        channelId: null,
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
        channelId: null,
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
      user.profile.channels.forEach(item => {
        this.channelIndex.push({
          name: item.name,
          unique: item._id,
          channelId: item._id,
          isStatic: false,
          selector: {
            channelId: item._id
          },
          options: {
            limit: 50
          }
        })
      })
      if (this.temp) {
        for (let i = 0, len = user.profile.channels.length; i < len; ++i) {
          const channel = user.profile.channels[i]
          if (channel._id === this.temp.unique) {
            return
          }
        }
        this.channelIndex.push(this.temp)
      }
    }
    this.index = timelines
  },
  setTemp (channel) {
    this.temp = {
      name: channel.name,
      unique: channel._id,
      isStatic: false,
      selector: {},
      options: {}
    }
  },
  setTempFromChannel (channelId) {
    this.temp = channelId
  },
  resetTemp () {
    this.temp = null
  },
  setCurrent ({channelId, useSocket, unique, name = ''}) {
    switch (unique) {
      case 'self':
        this.name = '自分の書き込み'
        break
      case 'follows':
        this.name = 'ユーザの書き込み'
        break
      default:
        this.name = '全ての書き込み'
        break
    }
    if (name) { this.name = name }
    this.channelId = channelId
    this.useSocket = useSocket
    this.unique = unique
  }
})
