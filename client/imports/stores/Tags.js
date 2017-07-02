import { Meteor } from 'meteor/meteor'
import { types } from 'mobx-state-tree'

export default types.model('Tags', {
  index: types.optional(types.array(types.model({})), [])
}, {
  findAllTags () {
    return new Promise((resolve, reject) => {
      Meteor.call('tags.findAll', {limit: 50}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  },
  findNewTags () {
    return new Promise((resolve, reject) => {
      Meteor.call('tags.findNew', {limit: 50}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  },
  findHotTags () {
    return new Promise((resolve, reject) => {
      Meteor.call('tags.findHot', {limit: 50}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
})
