import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import collections from '/collections'

// リアクションを更新する
Meteor.methods({
  'artworks.updateReplyReaction' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    check(req.postId, String)
    check(req.replyId, String)
    check(req.name, String)
    if (req.name.includes('.')) return
    const post = collections.artworks.findOne(req.postId)
    for (let i = 0, len = post.replies.length; i < len; ++i) {
      if (post.replies[i]._id !== req.replyId) continue
      const reactions = post.replies[i].reactions
      const path = 'replies.' + i + '.reactions.'
      // ↓ 更新
      if (reactions[req.name] === undefined) {
        const names = Object.keys(reactions)
        const nReactions = names.length
        if (nReactions === 1 && reactions[names[0]].length === 0) {
          collections.artworks.update(req.postId, {
            $unset: {[path + names[0]]: ''},
            $set: {[path + req.name]: [this.userId]}
          })
        } else {
          collections.artworks.update(req.postId, {
            $set: {[path + req.name]: [this.userId]}
          })
        }
      } else if (reactions[req.name].indexOf(this.userId) !== -1) {
        const nReactions = Object.keys(reactions).length
        if (nReactions > 1 && reactions[req.name].length === 1) {
          collections.artworks.update(req.postId, {
            $unset: {[path + req.name]: ''}
          })
        } else {
          if (reactions[req.name].length === 1 && req.name !== 'スキ') {
            collections.artworks.update(req.postId, {
              $set: {[path + 'スキ']: []},
              $unset: {[path + req.name]: ''}
            })
          } else {
            collections.artworks.update(req.postId, {
              $pull: {[path + req.name]: this.userId}
            })
          }
        }
      } else {
        collections.artworks.update(req.postId, {
          $push: {[path + req.name]: this.userId}
        })
      }
      break
    }
    return collections.artworks.findOne(req.postId)
  }
})
