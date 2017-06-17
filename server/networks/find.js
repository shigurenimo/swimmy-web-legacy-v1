import { Meteor } from 'meteor/meteor'
import collections from '/collections'

// 全てを取得
Meteor.methods({
  'networks.find' (selector, options) {
    return collections.networks.find(selector, options).fetch()
  }
})
