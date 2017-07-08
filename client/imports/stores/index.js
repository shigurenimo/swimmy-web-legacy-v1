import InputPost from './ui/InputPost'
import Info from './ui/info'
import Layout from './ui/Layout'
import Channels from './domain/Channels'
import Posts from './domain/Posts'
import Reports from './domain/Reports'
import Snackbar from './ui/Snackbar'
import Tags from './domain/Tags'
import Threads from './domain/Threads'
import Accounts from './domain/Accounts'
import Timelines from './domain/Timelines'
import Users from './domain/Users'

const accounts = Accounts.create({})
const info = Info.create({})
const inputPost = InputPost.create({})
const channels = Channels.create({publish: 'channels'})
const layout = Layout.create({})
const posts = Posts.create({publish: 'posts'})
const reports = Reports.create({})
const snackbar = Snackbar.create({})
const tags = Tags.create({})
const threads = Threads.create({publish: 'threads'})
const timelines = Timelines.create({})
const users = Users.create({})

export default {
  accounts,
  info,
  inputPost,
  layout,
  channels,
  posts,
  reports,
  snackbar,
  tags,
  threads,
  timelines,
  users
}
