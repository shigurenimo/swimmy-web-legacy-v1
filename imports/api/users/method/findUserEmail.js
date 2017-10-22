import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Accounts } from 'meteor/accounts-base'

Meteor.methods({
  checkUserEmail (req) {
    check(req.email, String)
    if (Accounts.findUserByEmail(req.email)) {
      return true
    } else {
      return false
    }
  }
})
