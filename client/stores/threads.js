import { Meteor } from 'meteor/meteor'
import { action, observable } from 'mobx'

// スレッドデータ
export default class Threads {
  tabs = []

  @observable
  index = []

  ids = {}

  @observable
  isFetching = false

  @action
  insertIndex (posts) {
    if (Array.isArray(posts)) {
      posts.forEach(post => {
        this.ids[post._id] = post
        this.index.push(post)
      })
    } else {
      this.ids[posts._id] = posts
      this.index.push(posts)
    }
    this.index = this.index.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  }

  @action
  fetch () {
    this.isFetching = true
    const selector = {}
    const options = {limit: 50}
    return new Promise((resolve, reject) => {
      Meteor.call('threads:fetch', selector, options, (err, res) => {
        this.isFetching = false
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
}
