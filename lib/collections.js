import { Mongo } from 'meteor/mongo'

export default {
  artworks: new Mongo.Collection('artworks'),
  channels: new Mongo.Collection('channels'),
  posts: new Mongo.Collection('posts'),
  reports: new Mongo.Collection('reports'),
  tags: new Mongo.Collection('tags')
}
