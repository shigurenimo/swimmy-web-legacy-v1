import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { action, observable, toJS } from 'mobx'

export default class {
  @observable index = []

  @observable one = null

  @observable timelines = []

  @observable timeline = null

  ids = {}

  @action
  insertIndex (data) {
    if (!data) return
    if (Array.isArray(data)) {
      data.forEach(post => {
        this.ids[post._id] = post
        this.index.push(post)
      })
    } else {
      this.ids[data._id] = data
      this.index.push(data)
    }
    this.index = this.index.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  @action
  updateIndex (dataId, data) {
    if (!this.ids[dataId]) return
    for (let i = 0, len = this.index.length; i < len; ++i) {
      if (dataId !== this.index[i]._id) continue
      this.ids[dataId] = data
      this.index[i] = data
      break
    }
  }

  @action
  removeIndex (dataId) {
    if (!this.ids[dataId]) return
    for (let i = 0, len = this.index.length; i < len; ++i) {
      if (dataId !== this.index[i]._id) continue
      this.ids[dataId] = null
      this.index.splice(i, 1)
      break
    }
  }

  updateOne (data) {
    if (!data) {
      this.one = null
    }
    this.one = data
  }

  fetch (selector, options) {
    return new Promise((resolve, reject) => {
      this.isFetching = true
      this.index = []
      this.ids = {}
      selector = toJS(selector)
      options = toJS(options)
      Meteor.call('networks.fetch', selector, options, (err, res) => {
        this.isFetching = false
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  fetchOne (selector, options) {
    return new Promise((resolve, reject) => {
      selector = toJS(selector)
      options = toJS(options)
      Meteor.call('networks.fetchOne', selector, options, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  fetchOneFromId (_id) {
    return this.fetchOne({_id}, {})
  }

  insert (next) {
    return new Promise((resolve, reject) => {
      Meteor.call('networks.insert', next, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  remove (networkId) {
    return new Promise((resolve, reject) => {
      Meteor.call('networks.remove', {networkId}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  updateBasic (networkId, name, next) {
    return new Promise((resolve, reject) => {
      let req = {networkId}
      req[name] = next
      Meteor.call('networks.update', req, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  join (networkId) {
    return new Promise((resolve, reject) => {
      Meteor.call('networks.join', {networkId}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  updateTimelineFromUnique (unique) {
    const timelines = this.timelines.slice()
    for (let i = 0, len = timelines.length; i < len; ++i) {
      if (timelines[i].unique !== unique) continue
      this.timeline = timelines[i]
      break
    }
    return toJS(this.timeline)
  }

  @action
  resetTimelines () {
    const user = Meteor.user()
    const timeline = {
      name: '全てのリスト',
      unique: 'default',
      selector: {},
      options: {
        limit: 50,
        sort: {updatedAt: -1}
      }
    }
    if (!this.timeline) {
      this.timeline = timeline
    }
    this.timelines = [timeline, {
      name: 'インターネット',
      unique: 'net',
      selector: {
        univ: {$exists: false}
      },
      options: {
        limit: 50,
        sort: {updatedAt: -1}
      }
    }, {
      name: 'サークル',
      unique: 'univ',
      selector: {
        univ: {$exists: true}
      },
      options: {
        limit: 50,
        sort: {updatedAt: -1}
      }
    }]
    if (user) {
      this.timelines.push({
        name: '県内のリスト',
        unique: 'channel',
        selector: {
          univ: {$exists: true},
          channel: user.profile.channel
        },
        options: {
          limit: 50,
          sort: {updatedAt: -1}
        }
      })
    }
  }

  onLogin () {
    this.resetTimelines()
  }

  onLogout () {
    this.resetTimelines()
  }

  constructor () {
    this.resetTimelines()
    Accounts.onLogin(this.onLogin.bind(this))
    Accounts.onLogout(this.onLogout.bind(this))
  }
}
