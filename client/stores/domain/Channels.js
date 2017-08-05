import { Meteor } from 'meteor/meteor'
import { types } from 'mobx-state-tree'
import { IndexModel, Model } from './Subscription'
import Channel from '/lib/models/Channel'

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
  updateBasic (channelId, name, next) {
    return new Promise((resolve, reject) => {
      let req = {channelId}
      req[name] = next
      Meteor.call('channels.update', req, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  },
  updateMember (channelId) {
    return new Promise((resolve, reject) => {
      Meteor.call('channels.updateMember', {channelId}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
})
