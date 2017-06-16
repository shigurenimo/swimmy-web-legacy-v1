import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import collections from '/collections'

// リプライを削除する
Meteor.methods({
  'artworks.removeReply' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    check(req.postId, String)
    check(req.replyId, String)
    const post = collections.artworks.findOne(req.postId)
    const replies = post.replies
    let reply = null
    for (let i = 0, len = replies.length; i < len; ++i) {
      if (replies[i]._id === req.replyId) {
        reply = replies[i]
      }
    }
    if (reply && reply.owner !== this.userId) {
      throw new Meteor.Error('not-authorized')
    }
    collections.artworks.update(req.postId, {
      $pull: {
        replies: reply
      }
    })
    return collections.artworks.findOne(req.postId)
  }
})
