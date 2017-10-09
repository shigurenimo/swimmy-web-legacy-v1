import { Meteor } from 'meteor/meteor'
import { types } from 'mobx-state-tree'
import User from '/imports/models/User'

export default types
.model('Users', {
  one: types.maybe(User)
})
.actions(self => {
  return {
    setOne (user) {
      self.one = user
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
            self.setOne(res)
            resolve(res)
          }
        })
      })
    },
    findOneFromUsername (username) {
      return self.findOne({username}, {})
    }
  }
})
