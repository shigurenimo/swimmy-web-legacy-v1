import { Meteor } from 'meteor/meteor'
import { observable } from 'mobx'

export default class {
  @observable index = null

  updateIndex (data) {
    this.index = data
  }

  fetch () {
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
