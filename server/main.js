import { Accounts } from 'meteor/accounts-base'
import { createApolloServer } from 'meteor/apollo'
import { Meteor } from 'meteor/meteor'

import { makeExecutableSchema } from 'graphql-tools'

import '/imports/api/account'
import '/imports/api/buckets'
import '/imports/api/channels'
import '/imports/api/logs'
import '/imports/api/posts'
import '/imports/api/report'
import '/imports/api/threads'
import '/imports/api/users'
import typeDefs from '/imports/api/schema.graphqls'
import resolvers from '/imports/api/resolvers'

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

const schema = makeExecutableSchema({typeDefs, resolvers})

createApolloServer({schema})
