import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import collections from '/lib/collections'

// 更新する
Meteor.methods({
  'artworks.update' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    const post = collections.artworks.findOne(req.postId)
    if (post.owner !== this.userId) return 409
    const set = {}
    const unset = {}
    if (req.isPublic) {
      const user = Meteor.users.findOne(this.userId)
      set.public = {
        username: user.username,
        name: user.profile.name,
        icon: ''
      }
    } else {
      unset.public = ''
    }
    if (req.isSecret !== undefined) {
      check(req.isSecret, Boolean)
      set.secret = req.isSecret
    }
    if (req.title !== undefined) {
      check(req.title, String)
      set.title = req.title
    }
    if (req.note !== undefined) {
      check(req.note, String)
      set.note = req.note
    }
    if (req.colors !== undefined) {
      check(req.colors, Array)
      set.colors = req.colors
    }
    const modifier = {}
    if (Object.keys(set).length > 0) modifier.$set = set
    if (Object.keys(unset).length > 0) modifier.$unset = unset
    collections.artworks.update(req.postId, modifier)
    return collections.artworks.findOne(req.postId)
  }
})
