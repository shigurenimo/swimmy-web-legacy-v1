import { Meteor } from 'meteor/meteor'
import { observable } from 'mobx'

export default class {
  @observable one = {}

  updateOne (user) {
    this.one = user
  }

  fetchOne (selector, options) {
    return new Promise((resolve, reject) => {
      Meteor.call('users.fetchProfile', selector, options, (err, res) => {
        if (err) {
          reject(err)
        } else {
          if (res) {
            res.profile.code = res.profile.code.split('')
          }
          resolve(res)
        }
      })
    })
  }

  fetchOneFromUsername (username) {
    return this.fetchOne({username}, {})
  }
}
