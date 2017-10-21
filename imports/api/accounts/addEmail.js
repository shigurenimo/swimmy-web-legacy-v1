import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Accounts } from 'meteor/accounts-base'

Meteor.methods({
  addEmail (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized', 'ログインが必要です')
    check(req.email, String)
    if (Accounts.findUserByEmail(req.email)) {
      throw new Meteor.Error('not', 'そのメールアドレスは既に存在します')
    }
    Accounts.addEmail(this.userId, req.email, false)
    // Accounts.sendVerificationEmail(userId, req.email)
  }
})
