import { Mongo } from 'meteor/mongo'

const artworks = new Mongo.Collection('artworks')

const networks = new Mongo.Collection('networks')

const posts = new Mongo.Collection('posts')

const reports = new Mongo.Collection('reports')

const tags = new Mongo.Collection('tags')

const collections = {artworks, networks, posts, reports, tags}

export { collections }
