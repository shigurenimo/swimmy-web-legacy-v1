import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'

Meteor.methods({
  'posts.remove' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')

    const post = collections.posts.findOne(req.postId)

    if (!post) return 200

    if (post.ownerId !== this.userId) return 409

    collections.posts.remove(post._id)

    if (post.reply) {
      collections.posts.update(post.reply, {
        $pull: {replies: post._id}
      })
    }

    if (post.tags) {
      post.tags.filter(tag => tag !== '').forEach(hashtag => {
        const tag = collections.tags.findOne({name: hashtag})
        if (tag) {
          if (tag.count < 2) {
            collections.tags.remove(tag._id)
          } else {
            collections.tags.update({name: hashtag}, {$inc: {count: -1}})
          }
        }
      })
    }

    return 200
  }
})
