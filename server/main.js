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
})

Meteor.startup(async () => {
  const {projectId, keyFilename} = Meteor.settings.private.googleCloud

  if (!projectId) return

  const temp = join(process.env.PWD, '.temp')

  await new Promise((resolve, reject) => {
    mkdir(temp, err => {
      if (err) { reject(err) } else {
        resolve()
      }
    })
  })

  // eslint-disable-next-line no-undef
  Assets.getText(keyFilename, (err, data) => {
    if (err) return
    if (data) {
      const dist = join(process.env.PWD, '.temp', keyFilename)
      writeFileSync(dist, data)
    }
  })
})
