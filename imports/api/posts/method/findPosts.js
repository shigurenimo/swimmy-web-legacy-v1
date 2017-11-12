import { Meteor } from 'meteor/meteor'

import { Posts } from '/imports/collection'
import createPathFromDate from '/imports/utils/createPathFromDate'
import replaceLink from '/imports/utils/replaceLink'

Meteor.methods({
  findPosts (selector, options) {
    if (selector.ownerId) {
      // then profile
      selector.owner = {$exists: true}
    }

    options.sort = {createdAt: -1}

    return Posts.find(selector, options).fetch()
    .map(post => {
      if (post.replyPostId) {
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
        const replyPost = Posts.findOne(post.replyPostId, options)
        if (replyPost) {
          post.replyPost = replyPost
        } else {
          post.replyPost = {
            content: 'この投稿は既に削除されています'
          }
        }
      }
      if (post.images) {
        post.imagePath =
          'https://storage.googleapis.com/' +
          Meteor.settings.private.googleCloud.bucket + '/' +
          createPathFromDate(post.createdAt)
      }

      if (post.link) post.content = replaceLink(post.content)

      if (this.userId !== post.ownerId) { delete post.ownerId }

      return post
    })
  }
})
