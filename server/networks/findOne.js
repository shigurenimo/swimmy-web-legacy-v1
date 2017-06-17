import { Meteor } from 'meteor/meteor'
import collections from '/collections'

// ひとつを取得
Meteor.methods({
  'networks.findOne' (selector, options) {
    const network = collections.networks.findOne(selector, options)
    if (network) {
      network.count = network.member.length
    }
    return network
  }
})
