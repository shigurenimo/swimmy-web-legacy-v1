import { Accounts } from 'meteor/accounts-base'
import { createApolloServer } from 'meteor/apollo'
import { Meteor } from 'meteor/meteor'
import { WebApp } from 'meteor/webapp'

import cors from 'cors'
import { makeExecutableSchema } from 'graphql-tools'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'

import '/imports/api/account/index'
import '/imports/api/buckets'
import '/imports/api/channels'
import '/imports/api/logs'
import '/imports/api/posts'
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

// eslint-disable-next-line no-new
new SubscriptionServer({
  schema,
  execute,
  subscribe
}, {
  server: WebApp.httpServer,
  path: '/graphql',
  configServer: expressServer => expressServer.use(cors()),
  graphiql: true,
  graphiqlPath: '/graphiql'
})
