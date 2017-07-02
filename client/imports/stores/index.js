import InputPost from './InputPost'
import Info from './info'
import Layout from './Layout'
import Networks from './Networks'
import Posts from './Posts'
import SocketPosts from './PostsSocket'
import Reports from './Reports'
import Snackbar from './Snackbar'
import Tags from './Tags'
import Threads from './Threads'
import Accounts from './Accounts'
import Timelines from './Timelines'
import UsersProfile from './UsersProfile'

const accounts = Accounts.create({})
const info = Info.create({})
const inputPost = InputPost.create({})
const layout = Layout.create({})
const posts = Posts.create({})
const postsSocket = SocketPosts.create({})
const snackbar = Snackbar.create({})
const tags = Tags.create({})
const threads = Threads.create({})
const timelines = Timelines.create({})

export default {
  accounts,
  info,
  inputPost,
  layout,
  networks: new Networks(),
  posts,
  postsSocket,
  reports: new Reports(),
  snackbar,
  tags,
  threads,
  timelines,
  usersProfile: new UsersProfile()
}
