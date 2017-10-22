import { Meteor } from 'meteor/meteor'

Meteor.publish('userData', function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId}, {
      fields: {
        'services.email': 0,
        'services.password': 0,
        'services.resume': 0,
        'services.twitter.accessToken': 0,
        'services.twitter.accessTokenSecret': 0
      }
    })
  } else {
    this.ready()
  }
})

Meteor.publish('users', function () {
  if (!this.userId) return null

  return Meteor.users.find({_id: this.userId}, {
    fields: {
      '_id': 1,
      'config': 1,
      'profile': 1,
      'services.email': 0,
      'services.password': 0,
      'services.resume': 0,
      'services.twitter.accessToken': 0,
      'services.twitter.accessTokenSecret': 0,
      'username': 1
    }
  })
})
