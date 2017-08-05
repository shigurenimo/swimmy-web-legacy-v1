import { Meteor } from 'meteor/meteor'
import { types } from 'mobx-state-tree'
import User from '/lib/models/User'

export default types.model('Users', {
  one: types.maybe(User)
}, {
  setOne (user) {
    this.one = user
  },
  findOne (selector, options) {
    return new Promise((resolve, reject) => {
      Meteor.call('users.findProfile', selector, options, (err, res) => {
        if (err) {
          reject(err)
        } else {
          if (res) {
            res.profile.code = res.profile.code.split('')
          }
          this.setOne(res)
          resolve(res)
        }
      })
    })
  },
  findOneFromUsername (username) {
    return this.findOne({username}, {})
  }
})
