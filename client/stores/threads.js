import { Meteor } from 'meteor/meteor'
import { action, observable } from 'mobx'

export default class {
  @observable index = []

  @observable isFetching = false

  tabs = []

  ids = {}

  @action
  insertIndex (posts) {
    this.index = []
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
      Meteor.call('threads.fetch', selector, options, (err, res) => {
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
