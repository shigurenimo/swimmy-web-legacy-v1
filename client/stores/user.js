import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { action, observable } from 'mobx'

// ユーザデータ
export default class User {
  @observable
  info = {} // ユーザのデータ

  cursor = null // カーソル

  get _id () { return Accounts.userId() }

  get username () { return this.info.username }

  get networks () { return this.info.profile.networks }

  get profile () { return this.info.profile }

  get follows () { return this.info.profile.follows }

  get services () { return this.info.services }

  get createdAt () { return this.info.createdAt }

  @observable
  followsIds = []

  @observable
  loginState = null

  // 未ログインのときtrueを返す
  get isNotLoggedIn () {
    return this.loginState === 'isNotLoggedIn'
  }

  // ログイン中のときtrueを返す
  get isLoggingIn () {
    return this.loginState === 'isLoggingIn'
  }

  // ログイン済みのときtrueを返す
  get isLogged () {
    return this.loginState === 'isLoggedIn'
  }

  address = null // ipアドレス

  unique = null // ユニークID

  // ipアドレスを取得する
  fetchAddress () {
    return new Promise((resolve, reject) => {
      Meteor.call('user:fetchAddress', (err, res) => {
        if (err) {
          reject(err)
        } else {
          this.address = res.address
          this.unique = res.unique
          resolve()
        }
      })
    })
  }

  insert ({username, password}) {
    return new Promise((resolve, reject) => {
      Meteor.call('user:insert', {username, password}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  // フォローを更新する
  updateFollow (userId) {
    return new Promise((resolve, reject) => {
      Meteor.call('user:updateFollow', {userId}, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  // ネームを更新する
  updateName (name) {
    return new Promise((resolve, reject) => {
      Meteor.call('user:setName', {name}, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  // ユーザネームを更新する
  updateUsername (username) {
    return new Promise((resolve, reject) => {
      Meteor.call('user:updateUsername', {username}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  checkExistUsername (username) {
    return new Promise((resolve, reject) => {
      Meteor.call('user:checkExistUsername', username, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  updateChannel (channel) {
    return new Promise((resolve, reject) => {
      Meteor.call('user:updateChannel', {
        channel: channel
      }, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

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
  }

  addEmail (email) {
    return new Promise((resolve, reject) => {
      Meteor.call('user:addEmail', {email}, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  removeEmail (email) {
    return new Promise((resolve, reject) => {
      Meteor.call('user:removeEmail', {email}, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  // ログインする
  @action
  onLogin () {
    const self = this
    Meteor.subscribe('user')
    if (self.cursor) {
      self.cursor.stop()
      self.cursor = null
    }
    const userId = Meteor.userId()
    self.cursor = Meteor.users.find(userId).observe({
      added (user) {
        user.profile.code = user.profile.code.split('')
        self.info = user
        self.followsIds = user.profile.follows.map(item => item._id)
        setTimeout(() => { self.loginState = 'isLoggedIn' }, 200)
      },
      changed (user) {
        user.profile.code = user.profile.code.split('')
        self.info = user
        self.followsIds = user.profile.follows.map(item => item._id)
      }
    })
  }

  @action
  onLogout () {
    this.loginState = 'isNotLoggedIn'
  }

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

  constructor () {
    if (Meteor.loggingIn()) {
      this.loginState = 'isLoggingIn'
    } else {
      this.loginState = 'isNotLoggedIn'
    }
    Accounts.onLogin(this.onLogin.bind(this))
    Accounts.onLogout(this.onLogout.bind(this))
  }
}
