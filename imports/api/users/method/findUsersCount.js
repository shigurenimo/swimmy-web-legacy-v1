import { Meteor } from 'meteor/meteor'

Meteor.methods({
  findUsersCount () {
    return Meteor.users.find().count()
  }
})
