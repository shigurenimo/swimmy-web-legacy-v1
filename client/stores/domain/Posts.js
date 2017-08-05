import { Meteor } from 'meteor/meteor'
import { types } from 'mobx-state-tree'
import Post from '/lib/models/Post'
import { IndexModel, Model } from './Subscription'

const PostIndex = types.compose('PostIndex', IndexModel, {
  index: types.optional(types.array(Post), [])
}, {
  subscribeFrom (unique) {
    switch (unique) {
      case 'self':
        const userId = Meteor.userId()
        return this.subscribe({ownerId: userId}, {
          limit: 50
        })
      default:
        return this.subscribe({}, {
          limit: 50
        })
      case 'storage':
        return this.subscribe({
          'images': {$exists: true}
        }, {
          limit: 50
        })
    }
  }
})

export default types.compose('Posts', Model, {
  map: types.maybe(types.map(PostIndex)),
  index: types.optional(types.array(Post), [])
}, {
  subscribeFrom (unique) {
    switch (unique) {
      case 'follows':
        return this.subscribe({}, {
          limit: 50
        })
      case 'self':
        const userId = Meteor.userId()
        return this.subscribe({ownerId: userId}, {
          limit: 50
        })
      case 'storage':
        return this.subscribe({
          'images': {$exists: true}
        }, {
          limit: 50
        })
      default:
        return this.subscribe({}, {
          limit: 50
        })
    }
  },
  updateReaction (postId, name) {
    return new Promise((resolve, reject) => {
      Meteor.call('posts.updateReaction', {
        postId: postId,
        name: name
      }, (err, res) => {
        if (err) { reject(err) } else { resolve(res) }
      })
    })
  }
})
