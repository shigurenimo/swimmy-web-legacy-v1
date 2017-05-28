import { Mongo } from 'meteor/mongo'

export default {
  artworks: new Mongo.Collection('artworks'),
  networks: new Mongo.Collection('networks'),
  posts: new Mongo.Collection('posts'),
  reports: new Mongo.Collection('reports'),
  tags: new Mongo.Collection('tags')
}
