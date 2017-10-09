import { Mongo } from 'meteor/mongo'

export default {
  artworks: new Mongo.Collection('artworks'),
  buckets: new Mongo.Collection('buckets'),
  channels: new Mongo.Collection('channels'),
  posts: new Mongo.Collection('posts'),
  reports: new Mongo.Collection('reports'),
  logs: new Mongo.Collection('logs')
}
