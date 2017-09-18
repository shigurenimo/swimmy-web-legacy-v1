import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { createApolloServer } from 'meteor/apollo'
import { makeExecutableSchema } from 'graphql-tools'
import typeDefs from '/server/schema.graphqls'
import resolvers from '/server/resolvers'
import { mkdir } from 'fs'
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

Meteor.startup(() => {
  const temp = join(process.env.PWD, '.temp')
  mkdir(temp, () => {})
})

const schema = makeExecutableSchema({typeDefs, resolvers})

createApolloServer({schema})