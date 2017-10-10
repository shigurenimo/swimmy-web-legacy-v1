import { Meteor } from 'meteor/meteor'
import { types } from 'mobx-state-tree'
import { createModel } from '/imports/packages/Sub'
import Channel from '/imports/models/Channel'

export default types
.model('Channels', {
  // model: createModel(Channel),
  one: types.maybe(Channel)
})
.actions(self => {
  return {
    findOne (selector = {}, options = {}) {
      return new Promise((resolve, reject) => {
        Meteor.call('channels.findOne', selector, options, (err, res) => {
          if (err) { reject(err) } else {
            self.setOne(res)
            resolve(res)
          }
        })
      })
    },
    updateBasic (channelId, name, next) {
      return new Promise((resolve, reject) => {
        let req = {channelId}
        req[name] = next
        Meteor.call('channels.update', req, (err, res) => {
          if (err) { reject(err) } else { resolve(res) }
        })
      })
    },
    updateMember (channelId) {
      return new Promise((resolve, reject) => {
        Meteor.call('channels.updateMember', {channelId}, (err, res) => {
          if (err) { reject(err) } else { resolve(res) }
        })
      })
    },
    setOne (model) {
      self.one = model
    }
  }
})
