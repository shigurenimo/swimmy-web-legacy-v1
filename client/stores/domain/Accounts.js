import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { types } from 'mobx-state-tree'
import User from '/lib/models/User'

export default types.compose('Accounts', User, {
  loginState: types.maybe(types.string),
  get isNotLoggedIn () { return this.loginState === 'isNotLoggedIn' },
  get isLoggingIn () { return this.loginState === 'isLoggingIn' },
  get isLogged () { return this.loginState === 'isLoggedIn' },
  login (email, password) {
    return new Promise((resolve, reject) => {
      Meteor.loginWithPassword(email, password, error => {
        if (error) { reject(error) } else { resolve() }
      })
    })
  },
  logout () {
    return new Promise((resolve, reject) => {
      Meteor.logout(err => {
        if (err) { reject(err) } else { resolve() }
      })
    })
  },
  insert ({username, password}) {
    return new Promise((resolve, reject) => {
      Meteor.call('users.insert', {username, password}, (err, res) => {
        if (err) { reject(err) } else { resolve(res) }
      })
    })
  },
  updateFollow (userId) {
    // フォローを更新する
    return new Promise((resolve, reject) => {
      Meteor.call('users.updateFollow', {userId}, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },
  updateName (name) {
    // ネームを更新する
    return new Promise((resolve, reject) => {
      Meteor.call('users.updateName', {name}, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },
  updateUsername (username) {
    // ユーザネームを更新する
    return new Promise((resolve, reject) => {
      Meteor.call('users.updateUsername', {username}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  },
  updateChannel (channel) {
    return new Promise((resolve, reject) => {
      Meteor.call('users.updateChannel', {
        channel: channel
      }, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },
  updatePassword (oldPassword, newPassword) {
    return new Promise((resolve, reject) => {
      Accounts.changePassword(oldPassword, newPassword, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },
  updatePushEmail (email) {
    return new Promise((resolve, reject) => {
      Meteor.call('users.updatePushEmail', {email}, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },
  updatePullEmail (email) {
    return new Promise((resolve, reject) => {
      Meteor.call('users.updatePullEmail', {email}, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  },
  updateServicesTwitter () {
    return new Promise((resolve, reject) => {
      Meteor.call('users.updateServicesTwitter', (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  },
  updateRemoveServicesTwitter () {
    return new Promise((resolve, reject) => {
      Meteor.call('users.updateRemoveServicesTwitter', (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  },
  updateConfigTwitter (name, value) {
    return new Promise((resolve, reject) => {
      Meteor.call('users.updateConfigTwitter', {name, value}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  },
  checkExistUsername (username) {
    return new Promise((resolve, reject) => {
      Meteor.call('users.checkExistUsername', username, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
}, {
  afterCreate () {
    this.followsIds = []
    this.cursor = null
    if (Meteor.loggingIn()) {
      this.loginState = 'isLoggingIn'
    } else {
      this.loginState = 'isNotLoggedIn'
    }
    // if (Meteor.userId()) { this.subscribe() }
    Accounts.onLogin(this.onLogin.bind(this))
    Accounts.onLogout(this.onLogout.bind(this))
  },
  added (model) {
    try {
      model.profile.code = model.profile.code.split('')
      this._id = model._id
      this.username = model.username
      this.profile = model.profile
      if (model.emails && model.emails[0]) {
        this.emails = model.emails
      }
      this.services = model.services
      this.createdAt = model.createdAt
      this.followsIds = model.profile.follows.map(item => item._id)
      if (model.config) { this.loginState = 'isLoggedIn' }
    } catch (e) {
      console.info('accounts.addded', e)
    }
  },
  changed (model) {
    try {
      model.profile.code = model.profile.code.split('')
      this._id = model._id
      this.username = model.username
      this.profile = model.profile
      if (model.emails && model.emails[0]) {
        this.emails = model.emails
      }
      this.services = model.services
      this.createdAt = model.createdAt
      this.followsIds = model.profile.follows.map(item => item._id)
      if (model.config) { this.loginState = 'isLoggedIn' }
    } catch (e) {
      console.info('accounts.changed', e)
    }
  },
  onLogin () {
    Meteor.subscribe('users')
    if (this.cursor) {
      this.cursor.stop()
      this.cursor = null
    }
    const userId = Meteor.userId()
    this.cursor = Meteor.users.find(userId)
    .observe({
      added: this.added,
      changed: this.changed
    })
  },
  onLogout () {
    this.loginState = 'isNotLoggedIn'
  }
})
