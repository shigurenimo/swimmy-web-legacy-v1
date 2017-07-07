import { Meteor } from 'meteor/meteor'
import { types } from 'mobx-state-tree'
import { IndexModel, Model } from './Subscription'

const Channel = types.model({
  _id: types.string,
  ownerId: types.string,
  name: types.string,
  description: types.string,
  member: types.array(types.string),
  region: types.string,
  createdAt: types.Date,
  updatedAt: types.Date
})

const ChannelIndex = types.compose('ChannelIndex', IndexModel, {
  one: types.maybe(Channel),
  index: types.optional(types.array(Channel), [])
})

export default types.compose('Channels', Model, {
  map: types.maybe(types.map(ChannelIndex)),
  one: types.maybe(Channel),
  index: types.optional(types.array(Channel), [])
}, {
  findFromUnique (unique) {
    switch (unique) {
      default:
        return this.find({})
    }
  },
  updateBasic (networkId, name, next) {
    return new Promise((resolve, reject) => {
      let req = {networkId}
      req[name] = next
      Meteor.call('networks.update', req, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  },
  updateMember (networkId) {
    return new Promise((resolve, reject) => {
      Meteor.call('networks.updateMember', {networkId}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
})
