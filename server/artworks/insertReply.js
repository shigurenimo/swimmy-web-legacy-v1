import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Random } from 'meteor/random'
import collections from '/lib/collections'

// リプライを挿入する
Meteor.methods({
  'artworks.insertReply' (req) {
    const address = this.connection.clientAddress
    check(req.postId, String)
    check(req.content, String)
    const reply = {
      _id: Random.id(),
      owner: this.userId,
      addr: address,
      public: req.isPublic,
      content: req.content,
      reactions: {'スキ': []},
      createdAt: new Date()
    }
    // ↓ 更新
    collections.artworks.update(req.postId, {$push: {replies: reply}})
    if (req.isPublic) {
      const user = Meteor.users.findOne(this.userId)
      reply.public = {
        username: user.username,
        name: user.profile.name
      }
    }
    return reply
  }
})
