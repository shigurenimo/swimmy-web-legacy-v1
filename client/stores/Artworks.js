import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { action, observable, toJS } from 'mobx'
import utils from '/lib/utils'

export default class {
  @observable index = []

  @observable one = null

  @observable isFetching = false

  @observable timeline = null

  ids = {}

  timelines = []

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

  @action
  pushIndex (posts) {
    if (Array.isArray(posts)) {
      posts.forEach(post => {
        post.imagePath =
          Meteor.settings.public.storage.artwork +
          utils.createPathFromDate(post.createdAt)
        this.ids[post._id] = post
        this.index.push(post)
      })
    } else {
      posts.imagePath =
        Meteor.settings.public.storage.artwork +
        utils.createPathFromDate(posts.createdAt)
      this.ids[posts._id] = posts
      this.index.push(posts)
    }
    this.index = this.index.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  pullIndex (postId) {
    if (!this.ids[postId]) return
    for (let i = 0, len = this.index.length; i < len; ++i) {
      if (postId !== this.index[i]._id) continue
      this.index.splice(i, 1)
      this.ids[postId] = null
      break
    }
  }

  replaceIndex (postId, post) {
    if (!this.ids[postId]) return
    for (let i = 0, len = this.index.length; i < len; ++i) {
      if (postId !== this.index[i]._id) continue
      post.imagePath =
        Meteor.settings.public.storage.artwork +
        utils.createPathFromDate(post.createdAt)
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
      Meteor.settings.public.storage.artwork +
      utils.createPathFromDate(post.createdAt)
    this.one = post
  }

  pushOneReply (reply) {
    this.one.replies.push(reply)
    this.one.replies = this.one.replies.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  pullOneReply (replyId) {
    for (let i = 0, len = this.one.replies.length; i < len; ++i) {
      if (this.one.replies[i]._id !== replyId) continue
      this.one.replies.splice(i, 1)
      break
    }
  }

  // タイムラインを変更する
  setTimelineFromUnique (unique) {
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

  @action
  find (selector, options) {
    return new Promise((resolve, reject) => {
      this.isFetching = true
      this.index = []
      this.ids = {}
      selector = toJS(selector)
      options = toJS(options)
      Meteor.call('artworks.find', selector, options, (err, res) => {
        this.isFetching = false
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  findOne (selector, options) {
    return new Promise((resolve, reject) => {
      selector = toJS(selector)
      options = toJS(options)
      Meteor.call('artworks.findOne', selector, options, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  findOneFromId (_id) {
    return this.findOne({_id: _id}, {})
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
      Meteor.call('artworks.insert', req, (err, res) => {
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
      Meteor.call('artworks.insertReply', {postId, content, isPublic}, (err, res) => {
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
      Meteor.call('artworks.update', req, (err, res) => {
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
      Meteor.call('artworks.updateReaction', {
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
      Meteor.call('artworks.updateReplyReaction', {postId, replyId, name}, (err, res) => {
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
      Meteor.call('artworks.remove', {postId}, (err, res) => {
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
      Meteor.call('artworks.removeReply', {postId, replyId}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
}
