import Artworks from './Artworks'
import InputPost from './InputPost'
import Layout from './Layout'
import Networks from './Networks'
import Posts from './Posts'
import PostsSocket from './PostsSocket'
import Process from './Process'
import Reports from './Reports'
import Snackbar from './Snackbar'
import Tags from './Tags'
import Threads from './Threads'
import Accounts from './Accounts'
import UsersProfile from './UsersProfile'

const accounts = Accounts.create({})
const inputPost = InputPost.create({})
const layout = Layout.create({})

export default {
  accounts,
  artworks: new Artworks(),
  inputPost,
  layout,
  networks: new Networks(),
  posts: new Posts(),
  postsSocket: new PostsSocket(),
  process: new Process(),
  reports: new Reports(),
  snackbar: new Snackbar(),
  tags: new Tags(),
  threads: new Threads(),
  usersProfile: new UsersProfile()
}
