import { Meteor } from 'meteor/meteor'
import { Posts, Channels } from '/imports/collection'
import createPathFromDate from '/imports/utils/createPathFromDate'
import replaceLink from '/imports/utils/replaceLink'

Meteor.methods({
  findPost (selector, options) {
    const post = Posts.findOne(selector, options)

    if (!post) { throw new Meteor.Error('not-found') }

    if (post.replyId) {
      const reply = Posts.findOne(post.reply)
      if (reply) {
        post.reply = reply
      } else {
        post.reply = {
          content: 'この投稿は既に削除されています'
        }
      }
    }

    if (post.replies && post.replies[0]) {
      post.replies = Posts.find({
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
            createPathFromDate(reply.createdAt)
        }
        reply.content = replaceLink(reply.content)
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
        createPathFromDate(post.createdAt)
    }

    if (post.channelId) {
      post.channel = Channels.findOne(post.channelId, {fields: {name: 1}})
    }

    post.content = replaceLink(post.content)

    if (this.userId !== post.ownerId) {
      delete post.ownerId
    }

    return post
  }
})
