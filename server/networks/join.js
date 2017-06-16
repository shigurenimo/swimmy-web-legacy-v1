import { Meteor } from 'meteor/meteor'
import collections from '/collections'

Meteor.methods({
  'networks.join' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    const networkId = req.networkId
    const network = collections.networks.findOne(networkId)
    if (network.member.includes(this.userId)) {
      collections.networks.update(networkId, {
        $pull: {
          'member': this.userId
        }
      })
      Meteor.users.update(this.userId, {
        $pull: {
          'profile.networks': {_id: networkId}
        }
      })
    } else {
      collections.networks.update(networkId, {
        $push: {
          'member': this.userId
        }
      })
      Meteor.users.update(this.userId, {
        $push: {
          'profile.networks': {
            _id: networkId,
            name: collections.networks.findOne(networkId).name
          }
        }
      })
    }
    return collections.networks.findOne(req.networkId)
  }
})
