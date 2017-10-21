import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

Meteor.methods({
  setPassword (currentPassword, newPassword) {
    if (!this.userId) throw new Meteor.Error('not-authorized')

    if (currentPassword !== newPassword) {
      throw new Error('パスワードが一致しません')
    }

    if (newPassword.length < 4) {
      throw new Error('パスワードが短すぎます')
    }

    Accounts.setPassword(this.userId, newPassword)

    return {message: 'パスワードを更新しました'}
  }
})
