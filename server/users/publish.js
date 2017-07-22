import { Meteor } from 'meteor/meteor'

Meteor.publish('users', function () {
  if (!this.userId) return null

  return Meteor.users.find({_id: this.userId}, {
    fields: {
      'services.email': 0,
      'services.password': 0,
      'services.resume': 0,
      'services.twitter.accessToken': 0,
      'services.twitter.accessTokenSecret': 0
    }
  })
})
