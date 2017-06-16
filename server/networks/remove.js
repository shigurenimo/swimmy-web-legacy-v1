import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import collections from '/collections'

Meteor.methods({
  'networks.remove' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    check(req.networkId, String)
    const network = collections.networks.findOne(req.networkId)
    console.log(network)
    if (this.userId !== network.owner) {
      throw new Meteor.Error('not', '削除するにはオーナーである必要があります')
    }
    collections.networks.remove(req.networkId)
    Meteor.users.update(this.userId, {
      $pull: {
        'profile.networks': {
          _id: req.networkId
        }
      }
    })
    return req.networkId
  }
})
