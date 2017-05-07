import { Meteor } from 'meteor/meteor'
import { collections } from '../imports/collections'

Meteor.publish('tags', function () {
  return collections.tags.find({})
})

Meteor.methods({
  // 新着ハッシュタグを取得する
  'tags:fetchAll' (req) {
    return collections.tags.find({thread: false}, {limit: req.limit, sort: {count: -1}}).fetch()
  },
  // 新着ハッシュタグを取得する
  'tags:fetchNew' (req) {
    return collections.tags.find({thread: false}, {limit: req.limit, sort: {createdAt: -1}}).fetch()
  },
  // ホットハッシュタグを取得する
  'tags:fetchHot' (req) {
    return collections.tags.find({thread: false}, {limit: req.limit, sort: {updatedAt: -1}}).fetch()
  },
  // スレッドタグを追加する
  'tags:insertThreadTag' () {
    return collections.tags.find({thread: true}, {limit: 100, sort: {updatedAt: -1}}).fetch()
  }
})
