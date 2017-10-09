import { Meteor } from 'meteor/meteor'
import collection from '/imports/collection'
import utils from '/imports/utils'

Meteor.methods({
  'posts.find' (selector, options) {
    if (selector.ownerId) {
      // then profile
      selector.owner = {$exists: true}
    }

    options.sort = {createdAt: -1}

    return collection.posts.find(selector, options).fetch()
    .map(post => {
      if (post.replyId) {
        const options = {
          fields: {
            _id: 1,
            content: 1,
            owner: 1,
            reactions: 1,
            extension: 1,
            createdAt: 1,
            updatedAt: 1
          }
        }
        const reply = collection.posts.findOne(post.replyId, options)
        if (reply) {
          post.reply = reply
        } else {
          post.reply = {
            content: 'この投稿は既に削除されています'
          }
        }
      }
      if (post.images) {
        post.imagePath =
          'https://storage.googleapis.com/' +
          Meteor.settings.private.googleCloud.bucket + '/' +
          utils.createPathFromDate(post.createdAt)
      }

      if (post.link) post.content = utils.replace.link(post.content)

      if (this.userId !== post.ownerId) { delete post.ownerId }

      return post
    })
  }
})
