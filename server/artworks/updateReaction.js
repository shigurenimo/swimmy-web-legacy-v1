import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import collections from '/collections'

// リアクションを更新する
Meteor.methods({
  'artworks.updateReaction' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    check(req.postId, String)
    check(req.name, String)
    if (req.name.includes('.')) return
    const post = collections.artworks.findOne(req.postId)
    // ↓ 更新
    if (post.reactions[req.name] === undefined) {
      const reactions = Object.keys(post.reactions)
      const nReactions = reactions.length
      if (nReactions === 1 && post.reactions[reactions[0]].length === 0) {
        collections.artworks.update(req.postId, {
          $unset: {['reactions.' + reactions[0]]: ''},
          $set: {['reactions.' + req.name]: [this.userId]}
        })
      } else {
        collections.artworks.update(req.postId, {
          $set: {['reactions.' + req.name]: [this.userId]}
        })
      }
    } else if (post.reactions[req.name].indexOf(this.userId) !== -1) {
      const nReactions = Object.keys(post.reactions).length
      if (nReactions > 1 && post.reactions[req.name].length === 1) {
        collections.artworks.update(req.postId, {
          $unset: {['reactions.' + req.name]: ''}
        })
      } else {
        if (post.reactions[req.name].length === 1 && req.name !== 'スキ') {
          collections.artworks.update(req.postId, {
            $set: {['reactions.' + 'スキ']: []},
            $unset: {['reactions.' + req.name]: ''}
          })
        } else {
          collections.artworks.update(req.postId, {
            $pull: {['reactions.' + req.name]: this.userId}
          })
        }
      }
    } else {
      collections.artworks.update(req.postId, {
        $push: {['reactions.' + req.name]: this.userId}
      })
    }
    return collections.artworks.findOne(req.postId)
  }
})
