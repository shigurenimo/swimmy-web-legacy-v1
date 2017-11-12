import { Meteor } from 'meteor/meteor'
import { Posts, Channels } from '/imports/collection'
import createPathFromDate from '/imports/utils/createPathFromDate'
import replaceLink from '/imports/utils/replaceLink'

Meteor.methods({
  findPost (selector, options) {
    const post = Posts.findOne(selector, options)

    if (!post) { throw new Meteor.Error('not-found') }

    if (post.replyPostId) {
      const replyPost = Posts.findOne(post.replyPostId)
      if (replyPost) {
        post.replyPost = replyPost
      } else {
        post.replyPost = {
          content: 'この投稿は既に削除されています'
        }
      }
    }

    if (post.repliedPostIds && post.repliedPostIds[0]) {
      post.repliedPosts = Posts.find({
        _id: {$in: post.repliedPostIds}
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
      .map(replyPost => {
        if (replyPost.images) {
          replyPost.imagePath =
            'https://storage.googleapis.com/' +
            Meteor.settings.private.googleCloud.bucket + '/' +
            createPathFromDate(replyPost.createdAt)
        }
        replyPost.content = replaceLink(replyPost.content)
        if (this.userId !== replyPost.ownerId) {
          delete replyPost.ownerId
        }
        return replyPost
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
