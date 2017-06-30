import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import collections from '/collections'
import utils from '/lib/utils'

Meteor.methods({
  'artworks.findOne' (selector, options) {
    const userId = this.userId
    const users = {}
    const post = collections.artworks.findOne(selector, options)
    if (!post) return null
    if (post.replies[0]) {
      post.replies = post.replies.map(reply => {
        reply.content = utils.replace.link(reply.content)
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
        reply.content = utils.replace.tags(reply.content)
        if (userId !== reply.owner) delete reply.owner
        delete reply.addr
        return reply
      })
    }
    post.note = utils.replace.link(post.note)
    post.note = utils.replace.tags(post.note)
    if (userId !== post.owner) delete post.owner
    post.unique = Random.createWithSeeds(post.addr).id()
    delete post.addr
    return post
  }
})
