import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Accounts } from 'meteor/accounts-base'

Meteor.methods({
  removeEmail (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized', 'ログインが必要です')
    check(req.email, String)
    Accounts.removeEmail(this.userId, req.email)
  }
})
