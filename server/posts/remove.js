import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import collections from '/collections'

Meteor.methods({
  'posts.remove' (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')
    const post = collections.posts.findOne(req.postId)
    if (post.owner !== this.userId) return 409
    collections.posts.remove(req.postId)
    if (post.reply) {
      collections.posts.update(post.reply, {
        $pull: {replies: post._id}
      })
    }
    // ↓ ハッシュタグの削除
    if (post.tags) {
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
    }
    // ↓ 画像の削除
    if (post.images && post.images[0]) {
      const image = post.images[0].full
      const imageMin = post.images[0].min
      if (image) {
        HTTP.del(Meteor.settings.public.api.post.image, {
          params: {
            name: image.replace(/\?.*$/, ''),
            name_min: imageMin.replace(/\?.*$/, ''),
            imagesDate: post.imagesDate,
            unique: 'DdcHJM68ksFbUA'
          }
        }, err => {
          if (err) throw new Meteor.Error('not', '画像の削除に失敗しました')
        })
      }
    }
    return 200
  }
})
