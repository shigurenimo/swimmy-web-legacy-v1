import { Meteor } from 'meteor/meteor'
import { collections } from '../imports/collections'

Meteor.methods({
  'report:main' () {
    const report = {
      total: {
        posts: collections.posts.find().count(),
        tags: collections.tags.find().count(),
        artworks: collections.artworks.find().count(),
        users: Meteor.users.find().count()
      }
    }
    if (this.userId) {
      report.user = {
        posts: collections.posts.find({owner: this.userId}).count(),
        artworks: collections.artworks.find({owner: this.userId}).count()
      }
    }
    return report
  }
})