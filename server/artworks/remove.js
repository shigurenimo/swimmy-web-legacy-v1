import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import collections from '/collections'

// 削除する
Meteor.methods({
  'artworks.remove' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    const post = collections.artworks.findOne(req.postId)
    if (post.owner !== this.userId) return 409
    collections.artworks.remove(req.postId)
    // ↓ ハッシュタグの削除
    post.tags.filter(tag => tag !== '').forEach(hashtag => {
      const tag = collections.tags.findOne({name: hashtag})
      if (tag) {
        if (tag.count < 2) {
          collections.tags.remove(tag._id)
        } else {
          collections.tags.update({name: hashtag}, {$inc: {count: -1}})
        }
      }
    })
    // ↓ 画像の削除
    if (post.image) {
      const image = post.image.full
      const imageMin = post.image.min
      if (image) {
        HTTP.del(Meteor.settings.public.api.work.image, {
          params: {
            name: image.replace(/\?.*$/, ''),
            name_min: imageMin.replace(/\?.*$/, ''),
            imageDate: post.imageDate,
            unique: 'DdcHJM68ksFbUA'
          }
        }, (err) => {
          if (err) throw new Meteor.Error(err)
        })
      }
    }
    return req.postId
  }
})
