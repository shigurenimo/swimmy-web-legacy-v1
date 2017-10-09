import { Meteor } from 'meteor/meteor'

Meteor.methods({
  'users.findProfile' (selector, options) {
    const user = Meteor.users.findOne(selector, options, {
      fields: {
        'services': 0,
        'emails': 0,
        'private': 0,
        'profile.channel': 0
      }
    })

    if (!user) {
      throw new Meteor.Error('not-found', 'ユーザが見つかりませんでした')
    }

    if (user.config && user.config.twitter) {
      if (user.config.twitter.useIcon) {
        user.profile.icon = user.services.twitter.profile_image_url_https.replace('_normal', '')
      }
    }

    delete user.services
    delete user.config

    return user
  }
})
