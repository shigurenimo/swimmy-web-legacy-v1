import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'

Meteor.methods({
  updateUserConfigTwitter (req) {
    if (!Meteor.settings.private.twitter) {
      throw new Meteor.Error('not found consumerKey')
    }
    if (!Meteor.settings.private.twitter.consumerKey) {
      throw new Meteor.Error('not found consumerKey')
    }

    const {name, value} = req

    check(name, String)
    check(value, Boolean)

    Meteor.users.update(this.userId, {
      $set: {
        ['config.twitter.' + name]: value
      }
    })
  }
})
