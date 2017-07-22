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

    return 200
  }
})
