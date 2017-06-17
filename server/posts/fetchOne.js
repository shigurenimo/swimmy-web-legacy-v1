import { Meteor } from 'meteor/meteor'
import collections from '/collections'
import utils from '/utils'

Meteor.methods({
  'posts.fetchOne' (selector, options) {
    const users = {}
    const post = collections.posts.findOne(selector, options)
    if (!post) return null
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
    if (post.replies && post.replies[0]) {
      post.replies = collections.posts.find({_id: {$in: post.replies}}, {sort: {createdAt: -1}}).fetch()
      .map(reply => {
        if (reply.public) {
          if (!users[reply.owner]) {
            users[reply.owner] = Meteor.users.findOne(reply.owner)
          }
          const user = users[reply.owner]
          if (user) {
            reply.public = {
              username: user.username,
              name: user.profile.name,
              icon: user.icon
            }
          }
        }
        reply.content = utils.replace.link(reply.content)
        // reply.content = utils.replace.tags(reply.content)
        if (this.userId !== reply.owner) delete reply.owner
        delete reply.addr
        return reply
      })
    }
    if (post.network) {
      post.networkInfo = collections.networks.findOne(post.network, {fields: {name: 1}})
    }
    post.content = utils.replace.link(post.content)
    // post.content = utils.replace.tags(post.content)
    if (this.userId !== post.owner) delete post.owner
    // post.unique = Random.createWithSeeds(post.addr).id()
    delete post.addr
    return post
  }
})
