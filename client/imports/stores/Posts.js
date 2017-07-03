import { Meteor } from 'meteor/meteor'
import { types } from 'mobx-state-tree'
import Post from './Post'

export default types.model('Posts', {
  one: types.maybe(Post),
  index: types.optional(types.array(Post), []),
  fetchState: types.optional(types.boolean, false),
  get isEmpty () { return this.index.length === 0 }
}, {
  afterCreate () {
    this.ids = {}
    this.cursor = null
    this.selector = null
    this.options = null
  },
  setIndex (models = []) {
    models.forEach(model => {
      this.ids[model._id] = model
    })
    try {
      this.index.replace(models)
    } catch (err) {
      console.info('Posts.setIndex')
      console.info(models)
      console.info(err)
    }
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
      const index = this.index.findIndex(item => item._id === model._id)
      this.index.splice(index, 1)
    } else {
      this.ids[model._id] = null
      this.index.remove(model)
    }
  },
  replaceIndex (model) {
    this.ids[model._id] = model
    const index = this.index.findIndex(item => item._id === model._id)
    try {
      this.index[index] = model
    } catch (err) {
      console.info('Posts.replaceIndex')
      console.info(...arguments)
      console.info(err)
    }
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
