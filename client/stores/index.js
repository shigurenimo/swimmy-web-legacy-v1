import Artworks from './Artworks'
import InputPost from './InputPost'
import Layout from './Layout'
import Navigation from './Navigation'
import Networks from './Networks'
import Posts from './Posts'
import PostsSocket from './PostsSocket'
import Process from './Process'
import Reports from './Reports'
import Router from './Router'
import Snackbar from './Snackbar'
import Tags from './Tags'
import Threads from './Threads'
import Users from './Users'
import UsersProfile from './UsersProfile'

export default {
  artworks: new Artworks(),
  inputPost: new InputPost(),
  layout: new Layout(),
  navigation: new Navigation(),
  networks: new Networks(),
  posts: new Posts(),
  postsSocket: new PostsSocket(),
  process: new Process(),
  reports: new Reports(),
  router: new Router(),
  snackbar: new Snackbar(),
  tags: new Tags(),
  threads: new Threads(),
  users: new Users(),
  usersProfile: new UsersProfile()
}
