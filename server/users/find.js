import { Meteor } from 'meteor/meteor'

Meteor.methods({
  'users.find' (username) {
    return Meteor.users.findOne({username: username}, {
      fields: {
        'services': 0,
        'private': 0
      }
    })
  }
})
