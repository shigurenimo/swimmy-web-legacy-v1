import { Meteor } from 'meteor/meteor'

Meteor.publish('users', function () {
  if (!this.userId) return null
  return Meteor.users.find({_id: this.userId}, {
    fields: {
      'services': 0
    }
  })
})
