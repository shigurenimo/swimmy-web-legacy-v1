import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import collections from '/collections'

Meteor.methods({
  'posts.updateReaction' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized', 'ログインが必要です')
    check(req.postId, String)
    check(req.name, String)
    if (req.name.includes('.')) {
      throw new Meteor.Error('not', 'ドットを含むことはできません')
    }
    const post = collections.posts.findOne(req.postId)
    if (post.reactions[req.name] === undefined) {
      const reactions = Object.keys(post.reactions)
      const nReactions = reactions.length
      if (nReactions === 1 && post.reactions[reactions[0]].length === 0) {
        if (req.name === '') {
          throw new Meteor.Error('not', '空のリアクションはダメです')
        }
        if (req.name.length > 10) {
          throw new Meteor.Error('not', '10文字以上のリアクションはダメです')
        }
        collections.posts.update(req.postId, {
          $unset: {['reactions.' + reactions[0]]: ''},
          $set: {['reactions.' + req.name]: [this.userId]}
        })
      } else {
        collections.posts.update(req.postId, {
          $set: {['reactions.' + req.name]: [this.userId]}
        })
      }
    } else if (post.reactions[req.name].indexOf(this.userId) !== -1) {
      const nReactions = Object.keys(post.reactions).length
      if (nReactions > 1 && post.reactions[req.name].length === 1) {
        collections.posts.update(req.postId, {
          $unset: {['reactions.' + req.name]: ''}
        })
      } else {
        if (post.reactions[req.name].length === 1 && req.name !== 'スキ') {
          collections.posts.update(req.postId, {
            $set: {['reactions.' + 'スキ']: []},
            $unset: {['reactions.' + req.name]: ''}
          })
        } else {
          collections.posts.update(req.postId, {
            $pull: {['reactions.' + req.name]: this.userId}
          })
        }
      }
    } else {
      collections.posts.update(req.postId, {
        $push: {['reactions.' + req.name]: this.userId}
      })
    }
    return collections.posts.findOne(req.postId, {
      fields: {
        owner: 0,
        addr: 0
      }
    })
  }
})
