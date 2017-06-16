import { Meteor } from 'meteor/meteor'
import { action, observable } from 'mobx'

export default class {
  @observable index = []

  // 全てのハッシュタグを取得する
  @action
  getAllTags () {
    return new Promise((resolve, reject) => {
      Meteor.call('tags.fetchAll', {limit: 50}, (err, res) => {
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
  getNewTags () {
    return new Promise((resolve, reject) => {
      Meteor.call('tags.fetchNew', {limit: 50}, (err, res) => {
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
  getHotTags () {
    return new Promise((resolve, reject) => {
      Meteor.call('tags.fetchHot', {limit: 50}, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    })
  }
}
