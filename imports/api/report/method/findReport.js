import { Meteor } from 'meteor/meteor'
import collection from '/imports/collection'

Meteor.methods({
  findReport () {
    const report = {
      total: {
        posts: collection.posts.find().count(),
        users: Meteor.users.find().count()
      }
    }
    if (this.userId) {
      report.user = {
        posts: collection.posts.find({ownerId: this.userId}).count()
      }
    }
    return report
  }
})
