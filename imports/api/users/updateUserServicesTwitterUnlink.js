import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

Meteor.methods({
  updateUserServicesTwitterUnlink () {
    Accounts.unlinkService(this.userId, 'twitter')

    return {reason: '接続を解除しました'}
  }
})
