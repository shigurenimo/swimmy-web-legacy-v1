import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { types } from 'mobx-state-tree'
import User from '/lib/imports/models/User'

export default types.model('Accounts', {
  one: types.maybe(User),
  loginState: types.maybe(types.string),
  get isNotLoggedIn () { return this.loginState === 'isNotLoggedIn' },
  get isLoggingIn () { return this.loginState === 'isLoggingIn' },
  get isLogged () { return this.loginState === 'isLoggedIn' }
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
    model.profile.code = model.profile.code.split('')
    this.one = model
    this.followsIds = model.profile.follows.map(item => item._id)
    if (model.config) { this.loginState = 'isLoggedIn' }
  },
  changed (model) {
    model.profile.code = model.profile.code.split('')
    this.one = model
    this.followsIds = model.profile.follows.map(item => item._id)
    if (model.config) { this.loginState = 'isLoggedIn' }
  },
  onLogin () {
    Meteor.subscribe('users')
    if (this.cursor) {
      this.cursor.stop()
      this.cursor = null
    }
    const userId = Meteor.userId()
    this.cursor = Meteor.users.find(userId).observe({
      added: model => {
        this.added(model)
      },
      changed: model => {
        this.changed(model)
      }
    })
  },
  onLogout () {
    this.loginState = 'isNotLoggedIn'
  },
  insert ({username, password}) {
    return new Promise((resolve, reject) => {
      Meteor.call('users.insert', {username, password}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  },
  // フォローを更新する
  updateFollow (userId) {
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
  // ネームを更新する
  updateName (name) {
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
  // ユーザネームを更新する
  updateUsername (username) {
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
  },
  // ログアウトする
  logout () {
    return new Promise((resolve, reject) => {
      Meteor.logout(err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
})
