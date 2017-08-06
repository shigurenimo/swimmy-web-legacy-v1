import Accounts from './domain/Accounts'
import Buckets from './domain/Buckets'
import Channels from './domain/Channels'
import Posts from './domain/Posts'
import Reports from './domain/Reports'
import Threads from './domain/Threads'
import Users from './domain/Users'
import Routes from './libs/Routes'
import Drawer from './ui/Drawer'
import Explore from './ui/Explore'
import Info from './ui/info'
import InputPost from './ui/InputPost'
import Snackbar from './ui/Snackbar'
import Timeline from './ui/Timeline'

const stores = {
  accounts: Accounts.create(),
  buckets: Buckets.create({publish: 'buckets'}),
  drawer: Drawer.create(),
  explore: Explore.create(),
  info: Info.create(),
  inputPost: InputPost.create(),
  channels: Channels.create({publish: 'channels'}),
  posts: Posts.create({publish: 'posts'}),
  reports: Reports.create(),
  snackbar: Snackbar.create(),
  threads: Threads.create({publish: 'threads'}),
  timeline: Timeline.create(),
  users: Users.create()
}

Routes.setStores(stores)

const routes = Routes.create()

Routes.run()

stores.routes = routes

export default stores
