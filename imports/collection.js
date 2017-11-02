import { Mongo } from 'meteor/mongo'

export const Buckets = new Mongo.Collection('buckets')
export const Channels = new Mongo.Collection('channels')
export const Posts = new Mongo.Collection('posts')
export const Logs = new Mongo.Collection('logs')
