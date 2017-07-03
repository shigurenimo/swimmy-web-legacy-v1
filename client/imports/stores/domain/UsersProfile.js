import { Meteor } from 'meteor/meteor'
import { observable } from 'mobx'

export default class {
  @observable one = {}

  setOne (user) {
    this.one = user
  }

  findOne (selector, options) {
    return new Promise((resolve, reject) => {
      Meteor.call('users.findProfile', selector, options, (err, res) => {
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

  findOneFromUsername (username) {
    return this.findOne({username}, {})
  }
}
