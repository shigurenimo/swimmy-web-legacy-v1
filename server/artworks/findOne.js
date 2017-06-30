import { Meteor } from 'meteor/meteor'
import collections from '/collections'
import utils from '/lib/utils'

Meteor.methods({
  'artworks.findOne' (selector, options) {
    const userId = this.userId

    const post = collections.artworks.findOne(selector, options)
    if (!post) return null
    if (post.replies[0]) {
      post.replies = post.replies.map(reply => {
        reply.content = utils.replace.link(reply.content)
        reply.content = utils.replace.tags(reply.content)
        if (userId !== reply.owner._id) delete reply.owner._id
        delete reply.addr
        return reply
      })
    }

    post.note = utils.replace.link(post.note)
    post.note = utils.replace.tags(post.note)

    if (userId !== post.owner._id) delete post.owner._id

    delete post.addr
    return post
  }
})
