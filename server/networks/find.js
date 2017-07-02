import { Meteor } from 'meteor/meteor'
import collections from '/lib/collections'

// 全てを取得
Meteor.methods({
  'networks.find' (selector, options) {
    return collections.networks.find(selector, options).fetch()
  }
})
