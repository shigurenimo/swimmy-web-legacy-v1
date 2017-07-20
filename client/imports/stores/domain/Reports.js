import { Meteor } from 'meteor/meteor'
import { types } from 'mobx-state-tree'

export default types.model('Reports', {
  one: types.maybe(
    types.union(
      types.model({
        total: types.model({
          posts: types.number,
          users: types.number
        }),
        user: types.maybe(types.model({
          posts: types.number
        }))
      })
    )
  )
}, {
  setOne (data) {
    try {
      this.one = data
    } catch (err) {
      console.info('stores/Reports.setOne', err)
    }
  },
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
})
