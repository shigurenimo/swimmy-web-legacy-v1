import { Meteor } from 'meteor/meteor'
import { destroy, types } from 'mobx-state-tree'
import Post from './Post'

export default types.model('Posts', {
  one: types.maybe(Post),
  index: types.optional(types.array(Post), []),
  ref: types.maybe(types.reference(Post)),
  fetchState: types.optional(types.boolean, false),
  get isEmpty () { return this.index.length === 0 }
}, {
  afterCreate () {
    this.ids = {}
    this.cursor = null
    this.selector = null
    this.options = null
  },
  setIndex (posts = []) {
    this.index = []
    posts.forEach(post => {
      this.ids[post._id] = post
      this.index.push(post)
    })
    this.index = this.index.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
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
  replaceIndex (model) {
    this.ids[model._id] = model
    try {
      for (let i = 0, len = this.index.length; i < len; ++i) {
        if (this.index[i]._id !== model._id) continue
        this.index[i] = model
        break
      }
    } catch (err) {
      console.info('Posts.replaceIndex')
      console.info(...arguments)
      console.info(err)
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
    try {
      this.one = post
    } catch (err) {
      console.info('Posts.replaceOne')
      console.info(...arguments)
      console.info(err)
    }
  },
  find (selector, options) {
    return new Promise((resolve, reject) => {
      this.setFetchState(true)
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
      if (next.networkId) {
        req.networkId = next.networkId
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
