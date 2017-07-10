import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'

Meteor.methods({
  'posts.remove' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')

    const model = collections.posts.findOne(req._id)

    if (!model) return 200

    if (model.ownerId !== this.userId) return 409

    collections.posts.remove(model._id)

    if (model.reply) {
      collections.posts.update(model.reply, {
        $pull: {replies: model._id}
      })
    }

    if (model.tags) {
      model.tags.filter(tag => tag !== '').forEach(hashtag => {
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
