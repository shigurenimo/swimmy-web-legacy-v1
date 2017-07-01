import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import collections from '/collections'

Meteor.methods({
  'posts.updateReaction' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized', 'ログインが必要です')

    check(req.postId, String)
    check(req.name, String)

    if (req.name === '') return

    const post = collections.posts.findOne(req.postId)

    const index = post.reactions.findIndex(item => item.name === req.name)
    const reaction = index !== -1 ? post.reactions[index] : null

    if (!reaction) {
      collections.posts.update(req.postId, {
        $push: {
          reactions: {
            name: req.name,
            owners: [this.userId]
          }
        }
      })
    }

    if (reaction && reaction.owners.length <= 1) {
      const hasOwner = reaction.owners.find(item => item === this.userId)
      if (!hasOwner) {
        collections.posts.update(req.postId, {
          $push: {
            ['reactions.' + index + '.owners']: this.userId
          }
        })
      }
      if (hasOwner) {
        collections.posts.update(req.postId, {
          $pull: {
            reactions: {name: req.name}
          }
        })
      }
    }

    if (reaction && reaction.owners.length > 1) {
      const hasOwner = reaction.owners.find(item => item === this.userId)
      if (!hasOwner) {
        collections.posts.update(req.postId, {
          $push: {
            ['reactions.' + index + '.owners']: this.userId
          }
        })
      }
      if (hasOwner) {
        collections.posts.update(req.postId, {
          $pull: {
            ['reactions.' + index + '.owners']: this.userId
          }
        })
      }
    }

    return collections.posts.findOne(req.postId, {
      fields: {
        ownerId: 0,
        addr: 0
      }
    })
  }
})
