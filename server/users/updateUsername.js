import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Accounts } from 'meteor/accounts-base'
import collections from '/lib/collections'

Meteor.methods({
  'users.updateUsername' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    check(req.username, String)
    const user = Meteor.users.findOne(this.userId)
    if (req.username.length === 0) {
      throw new Meteor.Error('not', '入力がありません')
    }
    if (req.username === user.username) {
      throw new Meteor.Error('not', 'ユーザネームが変わっていません')
    }
    if (req.username.length < 1) {
      throw new Meteor.Error('not', 'ユーザネームが短すぎます')
    }
    if (req.username.length > 20) {
      throw new Meteor.Error('not', 'ユーザネームが長すぎます')
    }
    if (req.username.length > 0 && req.username.match(new RegExp('[^A-Za-z0-9]+'))) {
      throw new Meteor.Error('not', 'ユーザネームは英数字のみです')
    }
    if (Meteor.settings.public.reservedWord.includes(req.username)) {
      throw new Meteor.Error('not', 'そのワードは予約されています')
    }
    if (Meteor.users.findOne({username: req.username})) {
      throw new Meteor.Error('not', 'そのユーザネームは既に存在します')
    }
    Accounts.setUsername(this.userId, req.username)
    collections.posts.update({'owner': this.userId, 'public': {$exists: true}}, {
      $set: {
        'public.username': req.username
      }
    }, {multi: true})
    collections.artworks.update({'owner': this.userId, 'public': {$exists: true}}, {
      $set: {
        'public.username': req.username
      }
    }, {multi: true})
    Meteor.users.update({'profile.follows._id': this.userId}, {
      $set: {
        'profile.follows.$.username': req.username
      }
    }, {multi: true})
    return 200
  }
})
