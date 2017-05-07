import { Meteor } from 'meteor/meteor'

Meteor.publish('users', function () {
  return Meteor.users.find({}, {
    fields: {
      'services': 0,
      'emails': 0,
      'private': 0
    }
  })
})

Meteor.methods({
  'users:fetch' (selector, options) {
    return Meteor.users.findOne(selector, options, {
      fields: {
        'services': 0,
        'emails': 0,
        'private': 0,
        'profile.channel': 0
      }
    })
  }
})
