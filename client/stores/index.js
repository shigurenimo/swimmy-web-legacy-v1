import Artworks from './artworks'
import InputPost from './input-post'
import Layout from './layout'
import Navigation from './navigation'
import Networks from './networks'
import Posts from './posts'
import PostsSocket from './posts-socket'
import Process from './process'
import Reports from './reports'
import Router from './router'
import Snackbar from './snackbar'
import Tags from './tags'
import Threads from './threads'
import Users from './users'
import UsersProfile from './users-profile'

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
