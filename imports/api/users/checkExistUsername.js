import { Meteor } from 'meteor/meteor'

Meteor.methods({
  'users.checkExistUsername' (username) {
    const user = Meteor.users.findOne({username: username})
    if (user) {
      return true
    } else {
      return false
    }
  }
})
