import { Meteor } from 'meteor/meteor'
import { observable } from 'mobx'

// その他ユーザデータ
export default class UserOther {
  @observable
  one = {}

  updateOne (user) {
    this.one = user
  }

  fetchOne (selector, options) {
    return new Promise((resolve, reject) => {
      Meteor.call('users:fetch', selector, options, (err, res) => {
        if (err) {
          reject(err)
        } else {
          res.profile.code = res.profile.code.split('')
          resolve(res)
        }
      })
    })
  }

  fetchOneFromUsername (username) {
    return this.fetchOne({username}, {})
  }
}
