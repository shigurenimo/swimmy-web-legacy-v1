import { Meteor } from 'meteor/meteor'
import collections from '/collections'
import utils from '/lib/utils'

Meteor.methods({
  'posts.find' (selector, options) {
    selector.thread = {$exists: false}
    if (selector.ownerId) {
      if (selector.ownerId !== this.userId) {
        selector.public = {$exists: true}
      }
    }

    options.sort = {createdAt: -1}

    return collections.posts.find(selector, options).fetch()
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
        const reply = collections.posts.findOne(post.replyId, options)
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
          Meteor.settings.public.storage.images +
          utils.createPathFromDate(post.createdAt)
      }

      if (post.link) post.content = utils.replace.link(post.content)

      // if (post.tags) post.content = utils.replace.tags(post.content)

      if (this.userId !== post.ownerId) {
        delete post.ownerId
      }

      return post
    })
  }
})
