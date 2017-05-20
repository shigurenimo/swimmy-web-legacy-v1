import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { action, observable, toJS } from 'mobx'

// 書き込みデータ
export default class Posts {
  @observable
  index = []

  @observable
  one = null

  ids = {}

  @observable
  isFetching = false

  @observable
  timelines = []

  @observable
  networkTimelines = []

  @observable
  timeline = null

  tempTimeline = null

  @observable
  networkInfo = false

  openNetworkInfo () {
    this.networkInfo = true
  }

  closeNetworkInfo () {
    this.networkInfo = false
  }

  @action
  insertIndex (posts) {
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
  updateIndex (postId, post) {
    if (!this.ids[postId]) return
    for (let i = 0, len = this.index.length; i < len; ++i) {
      if (postId !== this.index[i]._id) continue
      post.reply = this.ids[postId].reply
      this.ids[postId] = post
      this.index[i] = post
      break
    }
  }

  removeIndex (postId) {
    if (!this.ids[postId]) return
    for (let i = 0, len = this.index.length; i < len; ++i) {
      if (postId !== this.index[i]._id) continue
      this.index.splice(i, 1)
      this.ids[postId] = null
      break
    }
  }

  updateOne (post) {
    if (!post) {
      this.one = null
    }
    this.one = post
  }

  // データを取得する
  fetch (selector, options) {
    return new Promise((resolve, reject) => {
      this.isFetching = true
      this.index = []
      this.ids = {}
      selector = toJS(selector)
      options = toJS(options)
      Meteor.call('posts:fetch', selector, options, (err, res) => {
        this.isFetching = false
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  fetchFromUserId (userId) {
    const selector = {owner: userId}
    const options = {
      limit: 50,
      sort: {createdAt: -1}
    }
    return this.fetch(selector, options)
  }

  fetchOne (selector, options) {
    return new Promise((resolve, reject) => {
      selector = toJS(selector)
      options = toJS(options)
      Meteor.call('posts:fetchOne', selector, options, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  fetchOneFromId (postId) {
    const selector = {_id: postId}
    const options = {}
    return this.fetchOne(selector, options)
  }

  // 投稿を追加する
  insert (next) {
    return new Promise((resolve, reject) => {
      const req = {
        isPublic: next.isPublic,
        content: next.content
      }
      if (next.reply) {
        req.reply = next.reply
      }
      if (next.images) {
        req.images = next.images
        req.imagesDate = next.imagesDate
      }
      if (this.timeline.network) {
        req.network = this.timeline.network
      }
      Meteor.call('posts:insert', req, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  updateReaction (postId, name) {
    return new Promise((resolve, reject) => {
      Meteor.call('posts:updateReaction', {
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

  // 投稿を削除する
  remove (postId) {
    return new Promise((resolve, reject) => {
      Meteor.call('posts:remove', {
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

  // タイムラインを変更する
  updateTimeline (timeline) {
    this.timeline = timeline
    return toJS(timeline)
  }

  updateTimelineFromUnique (unique) {
    const timelines = this.timelines.slice()
    for (let i = 0, len = timelines.length; i < len; ++i) {
      if (timelines[i].unique !== unique) continue
      this.timeline = timelines[i]
      break
    }
    return toJS(this.timeline)
  }

  updateTimelineFromDate (y, m, d) {
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
          owner: user._id
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

  updatetTempTimeline (timeline) {
    this.tempTimeline = timeline
    return timeline
  }

  updatetTempTimelineFromNetwork (network) {
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

  onLogin () {
    this.resetTimelines()
  }

  onLogout () {
    this.resetTimelines()
  }

  constructor () {
    this.resetTimelines()
    Accounts.onLogin(this.onLogin.bind(this))
    Accounts.onLogout(this.onLogout.bind(this))
  }
}
