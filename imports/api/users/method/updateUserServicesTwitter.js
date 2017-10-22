import { Meteor } from 'meteor/meteor'
import Twit from 'twit'

Meteor.methods({
  async updateUserServicesTwitter () {
    if (!Meteor.settings.private.twitter) {
      throw new Meteor.Error('not found consumerKey')
    }
    if (!Meteor.settings.private.twitter.consumerKey) {
      throw new Meteor.Error('not found consumerKey')
    }

    const user = Meteor.users.findOne(this.userId)

    const accessToken = user.services.twitter.accessToken
    const accessTokenSecret = user.services.twitter.accessTokenSecret

    const twit = new Twit({
      consumer_key: Meteor.settings.private.twitter.consumerKey,
      consumer_secret: Meteor.settings.private.twitter.secret,
      access_token: accessToken,
      access_token_secret: accessTokenSecret,
      timeout_ms: 60 * 1000
    })

    const TwitterData = await new Promise((resolve, reject) => {
      twit.get('account/verify_credentials', (err, data, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(data)
        }
      })
    })

    Meteor.users.update(this.userId, {
      $set: {
        'services.twitter.screenName': TwitterData.screen_name,
        'services.twitter.description': TwitterData.description,
        'services.twitter.profile_image_url': TwitterData.profile_image_url,
        'services.twitter.profile_image_url_https': TwitterData.profile_image_url_https
      }
    })

    return {reason: '接続しました'}
  }
})
