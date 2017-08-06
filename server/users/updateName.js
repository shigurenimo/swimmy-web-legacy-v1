import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import collection from '/lib/collection'

Meteor.methods({
  'users.updateName' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized', 'ログインが必要です')
    check(req.name, String)
    const user = Meteor.users.findOne(this.userId)
    if (req.name.length === 0) {
      throw new Meteor.Error('not', '入力がありません')
    }
    if (req.name === user.profile.name) {
      throw new Meteor.Error('not', 'ハンドルネームが変わっていません')
    }
    if (req.name.length < 1) {
      throw new Meteor.Error('not', 'ハンドルネームが短すぎます')
    }
    if (req.name.length > 20) {
      throw new Meteor.Error('not', 'ハンドルネームが長すぎます')
    }
    Meteor.users.update(this.userId, {
      $set: {
        'profile.name': req.name
      }
    })
    collection.posts.update({'owner': this.userId, 'public': {$exists: true}}, {
      $set: {
        'public.name': req.name
      }
    }, {multi: true})
    collection.artworks.update({'owner': this.userId, 'public': {$exists: true}}, {
      $set: {
        'public.name': req.name
      }
    }, {multi: true})
    Meteor.users.update({'profile.follows._id': this.userId}, {
      $set: {
        'profile.follows.$.name': req.name
      }
    }, {multi: true})
    return 200
  }
})
