import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Accounts } from 'meteor/accounts-base'
import collection from '/imports/collection'
import reservedWord from '/imports/config/reservedWord'

Meteor.methods({
  updateUserUsername (username) {
    if (!this.userId) throw new Meteor.Error('not-authorized')

    check(username, String)

    const user = Meteor.users.findOne(this.userId)

    if (username.length === 0) { return }
    if (username === user.username) {
      throw new Meteor.Error('not', 'ユーザネームが変わっていません')
    }
    if (username.length < 1) {
      throw new Meteor.Error('not', 'ユーザネームが短すぎます')
    }
    if (username.length > 20) {
      throw new Meteor.Error('not', 'ユーザネームが長すぎます')
    }
    if (username.length > 0 && username.match(new RegExp('[^A-Za-z0-9]+'))) {
      throw new Meteor.Error('not', 'ユーザネームは英数字のみです')
    }
    if (reservedWord.includes(username)) {
      throw new Meteor.Error('not', 'そのワードは予約されています')
    }
    if (Meteor.users.findOne({username: username})) {
      throw new Meteor.Error('not', 'そのユーザネームは既に存在します')
    }

    Accounts.setUsername(this.userId, username)

    collection.posts.update({'ownerId': this.userId, 'owner': {$exists: true}}, {
      $set: {
        'public.username': username
      }
    }, {multi: true})

    Meteor.users.update({'profile.follows._id': this.userId}, {
      $set: {
        'profile.follows.$.username': username
      }
    }, {multi: true})

    return {reason: 'ユーザネームを更新しました'}
  }
})
