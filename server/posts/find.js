import { Meteor } from 'meteor/meteor'
import collections from '/collections'
import utils from '/utils'

Meteor.methods({
  'posts.find' (selector, options) {
    selector.thread = {$exists: false}
    options.sort = {createdAt: -1}
    if (selector.owner) {
      if (selector.owner !== this.userId) {
        selector.public = {$exists: true}
      }
    }
    return collections.posts.find(selector, options).fetch()
    .map(post => {
      if (post.reply) {
        const reply = collections.posts.findOne(post.reply)
        if (reply) {
          post.reply = reply
        } else {
          post.reply = {
            content: 'この投稿は既に削除されています'
          }
        }
      }
      if (post.link) post.content = utils.replace.link(post.content)
      // if (post.tags) post.content = utils.replace.tags(post.content)
      if (this.userId !== post.owner) delete post.owner
      delete post.addr
      return post
    })
  }
})
