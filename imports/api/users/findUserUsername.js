import { Meteor } from 'meteor/meteor'

Meteor.methods({
  findExistUsername (username) {
    const user = Meteor.users.findOne({username})
    if (user) {
      return true
    } else {
      return false
    }
  }
})
