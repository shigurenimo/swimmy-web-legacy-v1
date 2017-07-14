import { Meteor } from 'meteor/meteor'
import { connectReduxDevtools, types } from 'mobx-state-tree'
import InputPost from './ui/InputPost'
import Info from './ui/info'
import Layout from './ui/Layout'
import Channels from './domain/Channels'
import Posts from './domain/Posts'
import Reports from './domain/Reports'
import Routes from './domain/Routes'
import Snackbar from './ui/Snackbar'
import Tags from './domain/Tags'
import Threads from './domain/Threads'
import Accounts from './domain/Accounts'
import Timelines from './domain/Timelines'
import Users from './domain/Users'

const stores = {
  accounts: Accounts.create({}),
  info: Info.create({}),
  inputPost: InputPost.create({}),
  channels: Channels.create({publish: 'channels'}),
  layout: Layout.create({}),
  posts: Posts.create({publish: 'posts'}),
  reports: Reports.create({}),
  snackbar: Snackbar.create({}),
  tags: Tags.create({}),
  threads: Threads.create({publish: 'threads'}),
  timelines: Timelines.create({}),
  users: Users.create({})
}

Routes.setStores(stores)

const routes = Routes.createStore()

Routes.run()

stores.routes = routes

/*
if (Meteor.isDevelopment && window.navigator.userAgent.toLowerCase().includes('chrome')) {
  const remotedev = require('remotedev')
  const reduxStore = types.model({
    accounts: Accounts,
    info: Info,
    inputPost: InputPost,
    channels: Channels,
    layout: Layout,
    posts: Posts,
    reports: Reports,
    snackbar: Snackbar,
    tags: Tags,
    threads: Threads,
    timelines: Timelines,
    users: Users
  }).create(stores)
  connectReduxDevtools(remotedev, reduxStore)
}
*/

export default stores
