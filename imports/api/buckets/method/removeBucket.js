import { Meteor } from 'meteor/meteor'

import { Buckets } from '/imports/collection'

Meteor.methods({
  removeBucket (_id) {
    if (!this.userId) throw new Meteor.Error('not-authorized')

    Buckets.remove(_id)

    return {reason: 'バケットを削除しました'}
  }
})
