import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { action, observable, toJS } from 'mobx'
import utils from '/lib/utils'

export default class {
  @observable index = []

  @observable one = null

  @observable isFetching = false

  @observable timelines = []

  @observable networkTimelines = []

  @observable timeline = null

  @observable networkInfo = false

  ids = {}

  tempTimeline = null

  constructor () {
    this.resetTimelines()
    Accounts.onLogin(this.onLogin.bind(this))
    Accounts.onLogout(this.onLogout.bind(this))
  }

  onLogin () {
    this.resetTimelines()
  }

  onLogout () {
    this.resetTimelines()
  }

  openNetworkInfo () {
    this.networkInfo = true
  }

  closeNetworkInfo () {
    this.networkInfo = false
  }

  @action
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
  }

  @action
  pullIndex (postId) {
    if (!this.ids[postId]) return
    for (let i = 0, len = this.index.length; i < len; ++i) {
      if (postId !== this.index[i]._id) continue
      this.index.splice(i, 1)
      this.ids[postId] = null
      break
    }
  }

  @action
  replaceIndex (postId, post) {
    if (!this.ids[postId]) return
    for (let i = 0, len = this.index.length; i < len; ++i) {
      if (postId !== this.index[i]._id) continue
      post.imagePath =
        Meteor.settings.public.storage.images +
        utils.createPathFromDate(post.createdAt)
      post.replyId = this.ids[postId].replyId
      this.ids[postId] = post
      this.index[i] = post
      break
    }
  }

  replaceOne (post) {
    if (!post) {
      this.one = null
    }
    post.imagePath =
      Meteor.settings.public.storage.images +
      utils.createPathFromDate(post.createdAt)
    this.one = post
  }

  // タイムラインを変更する
  setTimeline (timeline) {
    this.timeline = timeline
    return toJS(timeline)
  }

  setTimelineFromUnique (unique) {
    const timelines = this.timelines.slice()
    for (let i = 0, len = timelines.length; i < len; ++i) {
      if (timelines[i].unique !== unique) continue
      this.timeline = timelines[i]
      break
    }
    return toJS(this.timeline)
  }

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
    return toJS(this.timeline)
  }

  @action
  resetTimelines () {
    const user = Meteor.user()
    const timeline = {
      name: '全ての書き込み',
      unique: 'default',
      network: null,
      isStatic: false,
      selector: {},
      options: {limit: 50}
    }
    if (!this.timeline) {
      this.timeline = timeline
    }
    this.timelines = [timeline]
    this.networkTimelines = []
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
          'public.username': {$in: user.profile.follows.map(item => item.username)}
        },
        options: {
          limit: 50
        }
      }].forEach(item => {
        this.timelines.push(item)
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
    return this.timelines
  }

  setTempTimeline (timeline) {
    this.tempTimeline = timeline
    return timeline
  }

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
  }

  resetTempTimelines () {
    this.tempTimeline = null
  }

  // データを取得する
  find (selector, options) {
    return new Promise((resolve, reject) => {
      this.isFetching = true
      this.index = []
      this.ids = {}
      selector = toJS(selector)
      options = toJS(options)
      Meteor.call('posts.find', selector, options, (err, res) => {
        this.isFetching = false
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  findFromUserId (userId) {
    const selector = {ownerId: userId}
    const options = {
      limit: 50,
      sort: {createdAt: -1}
    }
    return this.find(selector, options)
  }

  findOne (selector, options) {
    return new Promise((resolve, reject) => {
      selector = toJS(selector)
      options = toJS(options)
      Meteor.call('posts.findOne', selector, options, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  findOneFromId (postId) {
    const selector = {_id: postId}
    const options = {}
    return this.findOne(selector, options)
  }

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
  }

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
  }

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
}
