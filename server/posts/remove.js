import { Meteor } from 'meteor/meteor'
import collection from '/lib/collection'

Meteor.methods({
  'posts.remove' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')

    const model = collection.posts.findOne(req._id)

    if (!model) return 200

    if (model.ownerId !== this.userId) return 409

    collection.posts.remove(model._id)

    if (model.reply) {
      collection.posts.update(model.reply, {
        $pull: {replies: model._id}
      })
    }

    return 200
  }
})
