import { Meteor } from 'meteor/meteor'
import { observable } from 'mobx'

export default class {
  @observable index = null

  setIndex (data) {
    this.index = data
  }

  find () {
    return new Promise((resolve, reject) => {
      Meteor.call('report:main', (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
}
