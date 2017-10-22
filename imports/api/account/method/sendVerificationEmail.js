import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

Meteor.methods({
  sendVerificationEmail () {
    if (!this.userId) throw new Meteor.Error('not-authorized')

    Accounts.sendVerificationEmail(this.userId)
    
    return {reason: 'リンクを送信しました'}
  }
})
