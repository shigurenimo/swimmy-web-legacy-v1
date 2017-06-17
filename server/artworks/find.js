import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import collections from '/collections'
import utils from '/utils'

Meteor.methods({
  'artworks.find' (selector, options) {
    if (selector.owner) {
      if (selector.owner !== this.userId) {
        selector.public = {$exists: true}
      }
    }
    const posts = collections.artworks.find(selector, options).fetch()
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
      post.note = utils.replace.link(post.note)
      post.note = utils.replace.tags(post.note)
      if (this.userId !== post.owner) delete post.owner
      post.unique = Random.createWithSeeds(post.addr).id()
      delete post.addr
      return post
    })
    return posts
  }
})
