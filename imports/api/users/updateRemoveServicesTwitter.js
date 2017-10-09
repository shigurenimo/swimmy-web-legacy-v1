import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

Meteor.methods({
  'users.updateRemoveServicesTwitter' () {
    Accounts.unlinkService(this.userId, 'twitter')
  }
})
