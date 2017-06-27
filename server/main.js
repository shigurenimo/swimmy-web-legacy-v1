import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { mkdir, writeFileSync } from 'fs'
import { join } from 'path'

Meteor.startup(() => {
  if (!Meteor.settings.private.twitter) return
  if (!Meteor.settings.private.twitter.consumerKey) return
  Accounts.loginServiceConfiguration.remove({service: 'twitter'})
  Accounts.loginServiceConfiguration.insert({
    service: 'twitter',
    consumerKey: Meteor.settings.private.twitter.consumerKey,
    secret: Meteor.settings.private.twitter.secret
  })

  const temp = join(process.env.PWD, '.temp')
  mkdir(temp, err => err)

  const {keyFilePath} = Meteor.settings.private.googleCloud
  const keyFileData = require('./private/swimmy-5100fd52daa8.json')
  const dist = join(process.env.PWD, keyFilePath)
  writeFileSync(dist, JSON.stringify(keyFileData))
})
