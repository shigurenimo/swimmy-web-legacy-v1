import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { mkdir } from 'fs'

Meteor.startup(() => {
  if (!Meteor.settings.private.twitter) return
  if (!Meteor.settings.private.twitter.consumerKey) return
  Accounts.loginServiceConfiguration.remove({service: 'twitter'})
  Accounts.loginServiceConfiguration.insert({
    service: 'twitter',
    consumerKey: Meteor.settings.private.twitter.consumerKey,
    secret: Meteor.settings.private.twitter.secret
  })

  const temp = require('path').join(process.env.PWD, '.temp')
  mkdir(temp, err => err)
})
