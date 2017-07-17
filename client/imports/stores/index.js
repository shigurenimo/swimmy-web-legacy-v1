import Drawer from './ui/Drawer'
import Info from './ui/info'
import InputPost from './ui/InputPost'
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
  accounts: Accounts.create(),
  drawer: Drawer.create(),
  info: Info.create(),
  inputPost: InputPost.create(),
  channels: Channels.create({publish: 'channels'}),
  posts: Posts.create({publish: 'posts'}),
  reports: Reports.create(),
  snackbar: Snackbar.create(),
  tags: Tags.create(),
  threads: Threads.create({publish: 'threads'}),
  timelines: Timelines.create(),
  users: Users.create()
}

Routes.setStores(stores)

const routes = Routes.createStore()

Routes.run()

stores.routes = routes

export default stores
