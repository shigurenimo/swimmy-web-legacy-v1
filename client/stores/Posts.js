import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { destroy, getSnapshot, types } from 'mobx-state-tree'
import Post from './Post'
import Timeline from './Timeline'

export default types.model('Posts', {
  one: types.maybe(Post),
  index: types.optional(types.array(Post), []),
  ref: types.maybe(types.reference(Post)),
  fetchState: types.optional(types.boolean, false),
  timeline: types.maybe(types.reference(Timeline)),
  tempTimeline: types.maybe(Timeline),
  timelines: types.optional(types.array(Timeline), []),
  networkTimelines: types.optional(types.array(Timeline), []),
  networkInfo: types.optional(types.boolean, false)
}, {
  afterCreate () {
    this.ids = {}
    this.cursor = null
    this.selector = null
    this.options = null
    this.resetTimelines()
    Accounts.onLogin(this.onLogin.bind(this))
    Accounts.onLogout(this.onLogout.bind(this))
  },
  onLogin () {
    this.resetTimelines()
  },
  onLogout () {
    this.resetTimelines()
  },
  openNetworkInfo () {
    this.networkInfo = true
  },
  closeNetworkInfo () {
    this.networkInfo = false
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
  setFetchState (state) {
    this.fetchState = state
  },
  replaceOne (post) {
    if (!post) {
      this.one = null
    }
    this.one = post
  },
  // タイムラインを変更する
  setTimeline (timeline) {
    this.timeline = timeline.unique
    return getSnapshot(timeline)
  },
  setTimelineFromUnique (unique) {
    console.log('setTimelineFromUnique')
    const timelines = this.timelines
    for (let i = 0, len = timelines.length; i < len; ++i) {
      if (timelines[i].unique !== unique) continue
      this.timeline = timelines[i].unique
      break
    }
  },
  setTimelineFromDate (y, m, d) {
    this.timeline = {
      name: y + '.' + m + '.' + d,
      selector: {
        createdAt: {
          $gte: new Date(y, m - 1, d),
          $lt: new Date(y, m - 1, d + 1)
        }
      },
      options: {},
      other: {y, m, d}
    }
    return getSnapshot(this.timeline)
  },
  resetTimelines () {
    const timeline = {
      name: '全ての書き込み',
      unique: 'default',
      network: null,
      isStatic: false,
      selector: {},
      options: {limit: 50}
    }
    const timelines = [timeline]
    if (!this.timeline) {
      this.timeline = timeline.unique
    }
    this.networkTimelines = []
    const user = Meteor.user()
    if (user) {
      [{
        name: '自分の書き込み',
        unique: 'self',
        network: null,
        isStatic: true,
        selector: {
          ownerId: user._id
        },
        options: {
          limit: 50
        }
      }, {
        name: 'フォローユーザ',
        unique: 'follows',
        network: null,
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
        this.networkTimelines.push({
          name: item.name,
          unique: item._id,
          network: item._id,
          isStatic: false,
          selector: {
            network: item._id
          },
          options: {
            limit: 50
          }
        })
      })
      if (this.tempTimeline) {
        for (let i = 0, len = user.profile.networks.length; i < len; ++i) {
          const network = user.profile.networks[i]
          if (network._id === this.tempTimeline.unique) {
            return
          }
        }
        this.networkTimelines.push(this.tempTimeline)
      }
    }
    console.log('下 これ？')
    this.timelines = timelines
    console.log('上 これ？')
    return this.timelines
  },
  setTempTimeline (timeline) {
    this.tempTimeline = timeline
    return timeline
  },
  setTempTimelineFromNetwork (network) {
    const timeline = {
      name: network.name,
      unique: network._id,
      network: network._id,
      isStatic: false,
      selector: {network: network._id},
      options: {limit: 25}
    }
    this.tempTimeline = timeline
    return timeline
  },
  resetTempTimelines () {
    this.tempTimeline = null
  },
  // データを取得する
  find (selector, options) {
    return new Promise((resolve, reject) => {
      this.setFetchState(true)
      this.index = []
      this.ids = {}
      Meteor.call('posts.find', selector, options, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
        this.setFetchState(false)
      })
    })
  },
  findFromUserId (userId) {
    const selector = {ownerId: userId}
    const options = {
      limit: 50,
      sort: {createdAt: -1}
    }
    return this.find(selector, options)
  },
  findOne (selector, options) {
    return new Promise((resolve, reject) => {
      const {selector, options} = getSnapshot(this.timeline)
      Meteor.call('posts.findOne', selector, options, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  },
  findOneFromId (postId) {
    const selector = {_id: postId}
    const options = {}
    return this.findOne(selector, options)
  },
  insert (next) {
    return new Promise((resolve, reject) => {
      const req = {
        isPublic: next.isPublic,
        content: next.content
      }
      if (next.replyId) {
        req.replyId = next.replyId
      }
      if (next.images) {
        req.images = next.images
      }
      if (this.timeline.network) {
        req.networkId = this.timeline.networkId
      }
      Meteor.call('posts.insert', req, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  },
  remove (postId) {
    return new Promise((resolve, reject) => {
      Meteor.call('posts.remove', {
        postId: postId
      }, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },
  updateReaction (postId, name) {
    return new Promise((resolve, reject) => {
      Meteor.call('posts.updateReaction', {
        postId: postId,
        name: name
      }, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
})
