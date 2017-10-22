import { Meteor } from 'meteor/meteor'

import { Posts } from '/imports/collection'

Meteor.methods({
  findReport () {
    const report = {
      total: {
        posts: Posts.find().count(),
        users: Meteor.users.find().count()
      }
    }
    if (this.userId) {
      report.user = {
        posts: Posts.find({ownerId: this.userId}).count()
      }
    }
    return report
  }
})
