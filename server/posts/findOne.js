import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'
import utils from '/lib/utils'

Meteor.methods({
  'posts.findOne' (selector, options) {
    const post = collections.posts.findOne(selector, options)

    if (!post) return null

    if (post.replyId) {
      const reply = collections.posts.findOne(post.reply)
      if (reply) {
        post.reply = reply
      } else {
        post.reply = {
          content: 'この投稿は既に削除されています'
        }
      }
    }

    if (post.replies && post.replies[0]) {
      post.replies = collections.posts.find({
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
            Meteor.settings.public.storage.images +
            utils.createPathFromDate(reply.createdAt)
        }
        reply.content = utils.replace.link(reply.content)
        reply.content = utils.replace.tags(reply.content)
        if (this.userId !== reply.ownerId) {
          delete reply.ownerId
        }
        return reply
      })
    }

    if (post.images) {
      post.imagePath =
        Meteor.settings.public.storage.images +
        utils.createPathFromDate(post.createdAt)
    }

    if (post.networkId) {
      post.network = collections.networks.findOne(post.networkId, {fields: {name: 1}})
    }

    post.content = utils.replace.link(post.content)
    post.content = utils.replace.tags(post.content)

    if (this.userId !== post.ownerId) {
      delete post.ownerId
    }

    return post
  }
})
