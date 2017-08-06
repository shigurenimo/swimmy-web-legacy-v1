import { Meteor } from 'meteor/meteor'
import collection from '/lib/collection'
import utils from '/lib/imports/utils'

Meteor.methods({
  'posts.findOne' (selector, options) {
    const post = collection.posts.findOne(selector, options)

    if (!post) { throw new Meteor.Error('not-found') }

    if (post.replyId) {
      const reply = collection.posts.findOne(post.reply)
      if (reply) {
        post.reply = reply
      } else {
        post.reply = {
          content: 'この投稿は既に削除されています'
        }
      }
    }

    if (post.replies && post.replies[0]) {
      post.replies = collection.posts.find({
        _id: {$in: post.replies}
      }, {
        fields: {
          _id: 1,
          content: 1,
          owner: 1,
          reactions: 1,
          extension: 1,
          createdAt: 1,
          updatedAt: 1
        },
        sort: {createdAt: -1}
      }).fetch()
      .map(reply => {
        if (reply.images) {
          reply.imagePath =
            'https://storage.googleapis.com/' +
            Meteor.settings.private.googleCloud.bucket + '/' +
            utils.createPathFromDate(reply.createdAt)
        }
        reply.content = utils.replace.link(reply.content)
        if (this.userId !== reply.ownerId) {
          delete reply.ownerId
        }
        return reply
      })
    }

    if (post.images) {
      post.imagePath =
        'https://storage.googleapis.com/' +
        Meteor.settings.private.googleCloud.bucket + '/' +
        utils.createPathFromDate(post.createdAt)
    }

    if (post.channelId) {
      post.channel = collection.channels.findOne(post.channelId, {fields: {name: 1}})
    }

    post.content = utils.replace.link(post.content)

    if (this.userId !== post.ownerId) {
      delete post.ownerId
    }

    return post
  }
})
