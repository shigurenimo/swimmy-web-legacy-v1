import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

Meteor.methods({
  updateUserServicesTwitterUnlink () {
    Accounts.unlinkService(this.userId, 'twitter')
  }
})
