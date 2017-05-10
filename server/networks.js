import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { collections } from '../imports/collections'

// 全ての情報を公開
Meteor.publish('networks', function () {
  return collections.networks.find({})
})

Meteor.methods({
  // 全てのリスト情報を返す
  'networks:fetch' (selector, options) {
    /**
     */
    return collections.networks.find(selector, options).fetch()
  },
  // ひとつのリスト情報を返す
  'networks:fetchOne' (selector, options) {
    const network = collections.networks.findOne(selector, options)
    if (network) {
      network.count = network.member.length
    }
    return network
  },
  // 新規リストを作成する
  'networks:insert' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    check(req.name, String)
    check(req.description, String)
    const data = {
      owner: this.userId,
      name: req.name,
      description: req.description,
      member: [this.userId],
      tags: req.tags,
      channel: req.channel,
      sns: req.sns,
      schedule: {
        mon: [null, null],
        tue: [null, null],
        wed: [null, null],
        thu: [null, null],
        fri: [null, null],
        sat: [null, null],
        sun: [null, null]
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
    if (req.university) {
      data.univ = req.university
    }
    if (req.email) {
      data.email = req.email
    }
    if (req.place) {
      data.place = req.place
    }
    // ↓ リストの作成
    const networkId = collections.networks.insert(data)
    if (networkId) {
      Meteor.users.update(this.userId, {
        $push: {
          'profile.networks': {
            _id: networkId,
            name: req.name
          }
        }
      })
    }
    return collections.networks.findOne(networkId)
  },
  // リストの情報を更新する
  'networks:update' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    check(req.networkId, String)
    const set = {}
    const unset = {}
    if (req.name !== undefined) {
      check(req.name, String)
      set.name = req.name
    }
    if (req.description !== undefined) {
      check(req.description, String)
      set.description = req.description
    }
    if (req.header !== undefined) {
      check(req.header, String)
      if (req.header === '') {
        unset.header = ''
      } else {
        set.header = req.header
      }
    }
    if (req.univ !== undefined) {
      check(req.univ, String)
      if (req.univ === '') {
        unset.univ = ''
      } else {
        set.univ = req.univ
      }
    }
    if (req.place !== undefined) {
      check(req.place, String)
      if (req.place === '') {
        unset.place = ''
      } else {
        set.place = req.place
      }
    }
    if (req.channel !== undefined) {
      check(req.channel, String)
      set.channel = req.channel
    }
    if (req.email !== undefined) {
      check(req.email, String)
      if (req.email === '') {
        unset.email = ''
      } else {
        set.email = req.email
      }
    }
    if (req.sns !== undefined) {
      check(req.sns, Object)
      set.sns = req.sns
    }
    if (req.tags !== undefined) {
      check(req.tags, Array)
      set.tags = req.tags
    }
    if (req.schedule !== undefined) {
      check(req.bad, Object)
      set.schedule = req.schedule
    }
    set.updatedAt = new Date()
    if (Object.keys(set).length === 0 && Object.keys(unset).length === 0) return
    const query = {}
    if (Object.keys(set).length) query.$set = set
    if (Object.keys(unset).length) query.$unset = unset
    collections.networks.update(req.networkId, query)
    if (req.name !== undefined) {
      Meteor.users.update({'profile.networks._id': req.networkId}, {
        $set: {
          'profile.networks.$.name': req.name
        }
      }, {multi: true})
    }
    return collections.networks.findOne(req.networkId)
  },
  'networks:remove' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    check(req.networkId, String)
    const network = collections.networks.findOne(req.networkId)
    console.log(network)
    if (this.userId !== network.owner) {
      throw new Meteor.Error('not', '削除するにはオーナーである必要があります')
    }
    collections.networks.remove(req.networkId)
    Meteor.users.update(this.userId, {
      $pull: {
        'profile.networks': {
          _id: req.networkId
        }
      }
    })
    return req.networkId
  },
  'networks:join' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    const networkId = req.networkId
    const network = collections.networks.findOne(networkId)
    if (network.member.includes(this.userId)) {
      collections.networks.update(networkId, {
        $pull: {
          'member': this.userId
        }
      })
      Meteor.users.update(this.userId, {
        $pull: {
          'profile.networks': {_id: networkId}
        }
      })
    } else {
      collections.networks.update(networkId, {
        $push: {
          'member': this.userId
        }
      })
      Meteor.users.update(this.userId, {
        $push: {
          'profile.networks': {
            _id: networkId,
            name: collections.networks.findOne(networkId).name
          }
        }
      })
    }
    return collections.networks.findOne(req.networkId)
  }
})
