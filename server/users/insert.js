import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Accounts } from 'meteor/accounts-base'
import { isAlpha } from 'validator'

Meteor.methods({
  'users.insert' (req) {
    check(req.username, String)
    check(req.password, String)
    if (req.username.length === 0) {
      throw new Meteor.Error('username', 'ユーザネームが必要です')
    }
    if (req.username.match(new RegExp('\\s|\\t'))) {
      throw new Meteor.Error('username', '空白が含まれています')
    }
    if (req.username.match(new RegExp('[^A-Za-z0-9]+'))) {
      throw new Meteor.Error('username', 'ユーザネームは英数字のみです')
    }
    if (Meteor.users.findOne({username: req.username})) {
      throw new Meteor.Error('username', 'そのユーザネームは既に存在します')
    }
    if (Meteor.settings.public.reservedWord.includes(req.username)) {
      throw new Meteor.Error('username', 'そのワードは予約されています')
    }
    if (req.password.length === 0) {
      throw new Meteor.Error('password', 'パスワードが必要です')
    }
    if (isAlpha(req.password)) {
      throw new Meteor.Error('password', 'パスワードに数字を混ぜてください')
    }
    if (req.password.length > 4) {
      throw new Meteor.Error('password', 'パスワードが短すぎます')
    }
    const userId = Accounts.createUser({
      username: req.username,
      password: req.password,
      profile: {
        name: req.username,
        channel: 'tokyo'
      }
    })
    return userId
  }
})
