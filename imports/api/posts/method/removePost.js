import { join } from 'path'
import { Meteor } from 'meteor/meteor'
import Storage from '@google-cloud/storage'

import { Posts } from '/imports/collection'

Meteor.methods({
  removePost (req) {
    if (!this.userId) throw new Meteor.Error('not-authorized')

    const model = Posts.findOne(req._id)

    if (!model) return 200

    if (model.ownerId !== this.userId) return 409

    Posts.remove(model._id)

    if (model.replyPostId) {
      Posts.update(model.replyPostId, {
        $pull: {repliedPostIds: model._id}
      })
    }

    if (model.images) {
      const {projectId, keyFilename} = Meteor.settings.private.googleCloud
      const storage = Storage({
        projectId,
        // eslint-disable-next-line no-undef
        keyFilename: Assets.absoluteFilePath(keyFilename)
      })
      const date = model.createdAt
      const datePath = [
        date.getFullYear(),
        ('00' + (date.getUTCMonth() + 1)).slice(-2),
        ('00' + date.getUTCDate()).slice(-2)
      ].join('/')
      const images = model.images[0]
      const names = Object.keys(images)
      names.forEach(async name => {
        const path = join(datePath, images[name])
        await storage
        .bucket('swimmy')
        .file(path)
        .delete()
        .catch((err) => {
          console.error(err)
        })
      })
    }

    return {reason: '投稿を削除しました'}
  }
})
