import { Meteor } from 'meteor/meteor'
import { action, observable } from 'mobx'

export default class {
  @observable index = []

  // 全てのハッシュタグを取得する
  @action
  findAllTags () {
    return new Promise((resolve, reject) => {
      Meteor.call('tags.findAll', {limit: 50}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  // 新着ハッシュタグを取得する
  @action
  findNewTags () {
    return new Promise((resolve, reject) => {
      Meteor.call('tags.findNew', {limit: 50}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }

  // ホットハッシュタグを取得する
  @action
  findHotTags () {
    return new Promise((resolve, reject) => {
      Meteor.call('tags.findHot', {limit: 50}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
}
