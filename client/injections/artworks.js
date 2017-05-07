import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { action, observable, toJS } from 'mobx'

// アートワークデータ
class Artworks {
  @observable
  index = [] // 全てのデータ

  @observable
  one = null

  ids = {}

  @observable
  isFetching = false

  timelines = []

  @observable
  timeline = null

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

  updateIndex (postId, post) {
    if (!this.ids[postId]) return
    for (let i = 0, len = this.index.length; i < len; ++i) {
      if (postId !== this.index[i]._id) continue
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

  insertOneReply (reply) {
    this.one.replies.push(reply)
    this.one.replies = this.one.replies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  @action
  fetch (selector, options) {
    return new Promise((resolve, reject) => {
      this.isFetching = true
      this.index = []
      this.ids = {}
      selector = toJS(selector)
      options = toJS(options)
      Meteor.call('artworks:fetch', selector, options, (err, res) => {
        this.isFetching = false
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  fetchOne (selector, options) {
    return new Promise((resolve, reject) => {
      selector = toJS(selector)
      options = toJS(options)
      Meteor.call('artworks:fetchOne', selector, options, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  fetchOneFromId (_id) {
    return this.fetchOne({_id: _id}, {})
  }

  insert (next) {
    return new Promise((resolve, reject) => {
      if (!next.image) return
      const req = {
        isPublic: next.isPublic,
        isSecret: next.isSecret,
        type: next.type,
        title: next.title,
        note: next.note,
        colors: next.colors,
        rate: next.rate,
        tags: [],
        image: next.image,
        imageDate: next.imageDate
      }
      Meteor.call('artworks:insert', req, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  insertReply (postId, {content, isPublic}) {
    return new Promise((resolve, reject) => {
      Meteor.call('artworks:insertReply', {postId, content, isPublic}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  update (postId, next) {
    return new Promise((resolve, reject) => {
      const req = {
        postId,
        isPublic: next.isPublic,
        isSecret: next.isSecret,
        title: next.title,
        note: next.note,
        colors: next.colors.slice() // MobX-array
      }
      Meteor.call('artworks:update', req, (err, res) => {
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
      Meteor.call('artworks:updateReaction', {
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

  updateReplyReaction (postId, replyId, name) {
    return new Promise((resolve, reject) => {
      Meteor.call('artworks:updateReplyReaction', {postId, replyId, name}, (err, res) => {
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
      Meteor.call('artworks:remove', {postId}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  removeReply (postId, replyId) {
    return new Promise((resolve, reject) => {
      Meteor.call('artworks:removeReply', {postId, replyId}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  // タイムラインを変更する
  updateTimelineFromUnique (unique) {
    const timelines = this.timelines.slice()
    for (let i = 0, len = timelines.length; i < len; ++i) {
      if (timelines[i].unique !== unique) continue
      this.timeline = timelines[i]
      break
    }
    return toJS(this.timeline)
  }

  @action
  resetTimelines () {
    const user = Meteor.user()
    const timeline = {
      name: '全てのアートワーク',
      unique: 'default',
      isStatic: true,
      selector: {},
      options: {
        limit: 20,
        sort: {createdAt: -1}
      }
    }
    if (!this.timeline) {
      this.timeline = timeline
    }
    this.timelines = [timeline]
    if (user) {
      this.timelines.push({
        name: '自分のアートワーク',
        unique: 'self',
        isStatic: true,
        selector: {
          owner: user._id
        },
        options: {
          limit: 20,
          sort: {createdAt: -1}
        }
      })
      this.timelines.push({
        name: 'フォローユーザ',
        unique: 'follows',
        isStatic: true,
        selector: {
          'public.username': {$in: user.followUsernames}
        },
        options: {
          limit: 20,
          sort: {createdAt: -1}
        }
      })
    }
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

export { Artworks }
