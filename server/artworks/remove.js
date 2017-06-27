import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import collections from '/collections'

// 削除する
Meteor.methods({
  'artworks.remove' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    const post = collections.artworks.findOne(req.postId)
    if (post.owner !== this.userId) return 409
    collections.artworks.remove(req.postId)
    // ↓ ハッシュタグの削除
    post.tags.filter(tag => tag !== '').forEach(hashtag => {
      const tag = collections.tags.findOne({name: hashtag})
      if (tag) {
        if (tag.count < 2) {
          collections.tags.remove(tag._id)
        } else {
          collections.tags.update({name: hashtag}, {$inc: {count: -1}})
        }
      }
    })
    return req.postId
  }
})
