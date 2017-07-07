import { Meteor } from 'meteor/meteor'
import { action, observable, toJS } from 'mobx'

export default class {
  @observable index = []

  @observable one = null

  @observable timelines = []

  @observable timeline = null

  ids = {}

  @action
  pushIndex (data) {
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
  pullIndex (dataId) {
    if (!this.ids[dataId]) return
    for (let i = 0, len = this.index.length; i < len; ++i) {
      if (dataId !== this.index[i]._id) continue
      this.ids[dataId] = null
      this.index.splice(i, 1)
      break
    }
  }

  @action
  replaceIndex (dataId, data) {
    if (!this.ids[dataId]) return
    for (let i = 0, len = this.index.length; i < len; ++i) {
      if (dataId !== this.index[i]._id) continue
      this.ids[dataId] = data
      this.index[i] = data
      break
    }
  }

  replaceOne (model) {
    if (!model) { this.one = null }
    this.one = model
  }

  find (selector, options) {
    return new Promise((resolve, reject) => {
      this.isFetching = true
      this.index = []
      this.ids = {}
      Meteor.call('networks.find', selector, options, (err, res) => {
        this.isFetching = false
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  findFromTemplate (unique) {
    switch (unique) {
      case 'net':
        return this.find({
          univ: {$exists: false}
        }, {
          limit: 50,
          sort: {updatedAt: -1}
        })
      case 'univ':
        return this.find({
          univ: {$exists: true}
        }, {
          limit: 50,
          sort: {updatedAt: -1}
        })
      default:
        return this.find({}, {
          limit: 50,
          sort: {updatedAt: -1}
        })
    }
  }

  findOne (selector, options) {
    return new Promise((resolve, reject) => {
      Meteor.call('networks.findOne', selector, options, (err, res) => {
        if (err) { reject(err) } else { resolve(res) }
      })
    })
  }

  findOneFromId (_id) {
    return this.findOne({_id}, {})
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

  updateMember (networkId) {
    return new Promise((resolve, reject) => {
      Meteor.call('networks.updateMember', {networkId}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
}
