import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Accounts } from 'meteor/accounts-base'
import { Random } from 'meteor/random'
import { isAlpha } from 'validator'
import collections from '../imports/collections'

Meteor.publish('user', function () {
  if (!this.userId) return null
  return Meteor.users.find({_id: this.userId}, {
    fields: {
      'services': 0
    }
  })
})

Meteor.methods({
  'user:fetchAddress' () {
    const address = this.connection.clientAddress
    const unique = Random.createWithSeeds(address).id()
    return {unique: unique, address: address}
  },
  'user:fetch' (username) {
    return Meteor.users.findOne({username: username}, {
      fields: {
        'services': 0,
        'private': 0
      }
    })
  },
  'user:sendVerifificationLink' () {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    Accounts.sendVerificationEmail(this.userId)
  },
  'user:checkExistUsername' (username) {
    const user = Meteor.users.findOne({username: username})
    if (user) {
      return true
    } else {
      return false
    }
  },
  'user:insert' (req) {
    check(req.username, String)
    check(req.password, String)
    check(req.passwordRetype, String)
    if (req.username.length === 0) {
      throw new Meteor.Error('not', 'ユーザネームが必要です')
    }
    if (req.username.match(new RegExp('[^A-Za-z0-9]+'))) {
      throw new Meteor.Error('not', 'ユーザネームは英数字のみです')
    }
    if (Meteor.users.findOne({username: req.username})) {
      throw new Meteor.Error('not', 'そのユーザネームは既に存在します')
    }
    if (Meteor.settings.public.reservedWord.includes(req.username)) {
      throw new Meteor.Error('not', 'そのワードは予約されています')
    }
    if (req.password.length === 0) {
      throw new Meteor.Error('not', 'パスワードが必要です')
    }
    if (isAlpha(req.password)) {
      throw new Meteor.Error('not', 'パスワードに数字を混ぜてください')
    }
    if (req.password !== req.passwordRetype) {
      throw new Meteor.Error('not', 'パスワードが一致しません')
    }
    const userId = Accounts.createUser({
      username: req.username,
      password: req.password,
      profile: {
        name: req.username,
        channel: 'tokyo'
      }
    })
    return userId
  },
  'user:updateFollow' (req) {
    const userId = this.userId
    if (!userId) throw new Meteor.Error('not-authorized')
    check(req.userId, String)
    const user = Meteor.users.findOne(userId)
    const other = Meteor.users.findOne(req.userId)
    const isExist = user.profile.follows.filter(item => item._id === req.userId)[0]
    if (isExist) {
      Meteor.users.update(userId, {
        $pull: {
          'profile.follows': {
            _id: other._id,
            username: other.username,
            name: other.profile.name,
            code: other.profile.code,
            icon: other.profile.icon
          }
        }
      })
    } else {
      Meteor.users.update(userId, {
        $push: {
          'profile.follows': {
            _id: other._id,
            username: other.username,
            name: other.profile.name,
            code: other.profile.code,
            icon: other.profile.icon
          }
        }
      })
    }
    return 200
  },
  // ユーザネームを設定する
  'user:updateUsername' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    check(req.username, String)
    const user = Meteor.users.findOne(this.userId)
    if (req.username.length === 0) {
      throw new Meteor.Error('not', '入力がありません')
    }
    if (req.username === user.username) {
      throw new Meteor.Error('not', 'ユーザネームが変わっていません')
    }
    if (req.username.length < 1) {
      throw new Meteor.Error('not', 'ユーザネームが短すぎます')
    }
    if (req.username.length > 20) {
      throw new Meteor.Error('not', 'ユーザネームが長すぎます')
    }
    if (req.username.length > 0 && req.username.match(new RegExp('[^A-Za-z0-9]+'))) {
      throw new Meteor.Error('not', 'ユーザネームは英数字のみです')
    }
    if (Meteor.settings.public.reservedWord.includes(req.username)) {
      throw new Meteor.Error('not', 'そのワードは予約されています')
    }
    if (Meteor.users.findOne({username: req.username})) {
      throw new Meteor.Error('not', 'そのユーザネームは既に存在します')
    }
    Accounts.setUsername(this.userId, req.username)
    collections.posts.update({'owner': this.userId, 'public': {$exists: true}}, {
      $set: {
        'public.username': req.username
      }
    }, {multi: true})
    collections.artworks.update({'owner': this.userId, 'public': {$exists: true}}, {
      $set: {
        'public.username': req.username
      }
    }, {multi: true})
    Meteor.users.update({'profile.follows._id': this.userId}, {
      $set: {
        'profile.follows.$.username': req.username
      }
    }, {multi: true})
    return 200
  },
  // 名前を設定する
  'user:setName' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized', 'ログインが必要です')
    check(req.name, String)
    const user = Meteor.users.findOne(this.userId)
    if (req.name.length === 0) {
      throw new Meteor.Error('not', '入力がありません')
    }
    if (req.name === user.profile.name) {
      throw new Meteor.Error('not', 'ハンドルネームが変わっていません')
    }
    if (req.name.length < 1) {
      throw new Meteor.Error('not', 'ハンドルネームが短すぎます')
    }
    if (req.name.length > 20) {
      throw new Meteor.Error('not', 'ハンドルネームが長すぎます')
    }
    Meteor.users.update(this.userId, {
      $set: {
        'profile.name': req.name
      }
    })
    collections.posts.update({'owner': this.userId, 'public': {$exists: true}}, {
      $set: {
        'public.name': req.name
      }
    }, {multi: true})
    collections.artworks.update({'owner': this.userId, 'public': {$exists: true}}, {
      $set: {
        'public.name': req.name
      }
    }, {multi: true})
    Meteor.users.update({'profile.follows._id': this.userId}, {
      $set: {
        'profile.follows.$.name': req.name
      }
    }, {multi: true})
    return 200
  },
  // 地域を修正する
  'user:updateChannel' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    check(req.channel, String)
    Meteor.users.update(this.userId, {
      $set: {
        'profile.channel': req.channel
      }
    })
    return 200
  },
  // メールアドレスを追加する
  'user:removeEmail' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized', 'ログインが必要です')
    check(req.email, String)
    Accounts.removeEmail(this.userId, req.email)
  },
  // メールアドレスを追加する
  'user:addEmail' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized', 'ログインが必要です')
    check(req.email, String)
    if (Accounts.findUserByEmail(req.email)) {
      throw new Meteor.Error('not', 'そのメールアドレスは既に存在します')
    }
    Accounts.addEmail(this.userId, req.email, false)
    // Accounts.sendVerificationEmail(userId, req.email)
  },
  'user:checkEmail' (req) {
    check(req.email, String)
    if (Accounts.findUserByEmail(req.email)) {
      return true
    } else {
      return false
    }
  }
})

// ユーザー作成時の初期化
Accounts.onCreateUser(function (options, user) {
  const code = Array.from(new Array(25).keys())
  .map(() => (Math.random() < 0.1) ? 2 : (Math.random() < 0.5) ? 1 : 0)
  code[Math.floor(Math.random() * 25)] = 3
  user.profile = options.profile || {}
  user.profile.description = ''
  user.profile.icon = null
  user.profile.follows = []
  user.profile.tags = []
  user.profile.code = code.join('')
  user.profile.networks = []
  user.profile.from = 'swimmy'
  return user
})
