import { Meteor } from 'meteor/meteor'
import { observable } from 'mobx'

// レポートデータ
export default class Reports {
  @observable
  index = null

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
