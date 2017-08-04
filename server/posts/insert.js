import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Random } from 'meteor/random'
import { unlink, writeFileSync } from 'fs'
import { join } from 'path'
import Jimp from 'jimp'
import upload from '/lib/imports/utils/server/google/upload'
import collections from '/lib/collections'
import extendWeb from '/server/packages/extendWeb'

Meteor.methods({
  async 'posts.insert' (req) {
    check(req.isPublic, Boolean)
    check(req.content, String)

    if (req.images) {
      check(req.images, Array)
    } else {
      if (req.content === '') return
    }

    if (!req.images && req.content.length < 1) {
      throw new Meteor.Error('ignore', '入力がありません')
    }

    const date = new Date()

    const data = {
      content: req.content,
      reactions: [],
      replies: [],
      channelId: req.channelId || '',
      extension: {},
      createdAt: date,
      updatedAt: date,
      from: 'swimmy'
    }

    data.ownerId = this.userId

    if (req.isPublic) {
      if (!this.userId) throw new Meteor.Error('not-authorized')
      const user = Meteor.users.findOne(this.userId)
      data.owner = {
        username: user.username
      }
    }

    if (req.images) {
      const {projectId} = Meteor.settings.private.googleCloud
      if (projectId) {
        const image = await uploadImage(date, req.images[0])
        data.images = [image]
      }
    }

    const web = extendWeb(req.content, date)

    if (web) { data.extension.web = web }

    if (req.replyId) {
      check(req.replyId, String)
      const reply = collections.posts.findOne(req.replyId)
      if (reply) {
        data.replyId = reply._id
      } else {
        data.replyId = req.replyId
      }
      if (reply.channelId) {
        data.channelId = reply.channelId
      }
    }

    const postId = collections.posts.insert(data)

    if (data.replyId) {
      collections.posts.update(data.replyId, {
        $push: {replies: postId},
        $set: {updatedAt: date}
      })
    }
  }
})

async function uploadImage (date, base64) {
  const buf = Buffer.from(base64, 'base64')

  const ext = '.jpg'
  const name = Random.id()

  const temp = join(process.env.PWD, '.temp', name + ext)

  writeFileSync(temp, buf)

  const fileName = {
    full: name + ext,
    x128: name + '.x128' + ext,
    x256: name + '.x256' + ext,
    x512: name + '.x512' + ext,
    x1024: name + '.x1024' + ext
  }

  const bucketName = 'swimmy'

  const datePath = [
    date.getFullYear(),
    ('00' + (date.getMonth() + 1)).slice(-2),
    ('00' + date.getDate()).slice(-2)
  ].join('/')

  const filePath = {
    full: join(datePath, fileName.full),
    x256: join(datePath, fileName.x256),
    x512: join(datePath, fileName.x512),
    x1024: join(datePath, fileName.x1024)
  }

  await upload(bucketName, temp, filePath.full)

  // x256
  const x256 = join(process.env.PWD, '.temp', fileName.x256)
  const x256Ref = await Jimp.read(temp)
  x256Ref.resize(512, Jimp.AUTO)
  .exifRotate()
  .write(x256)

  await upload(bucketName, x256, filePath.x256)

  unlink(x256, err => err)

  // x512
  const x512 = join(process.env.PWD, '.temp', fileName.x512)
  const x512Ref = await Jimp.read(temp)
  x512Ref.resize(512, Jimp.AUTO)
  .exifRotate()
  .write(x512)

  await upload(bucketName, x512, filePath.x512)

  unlink(x512, err => err)

  // x1024
  const x1024 = join(process.env.PWD, '.temp', fileName.x512)
  const x1024Ref = await Jimp.read(temp)
  x1024Ref.resize(1024, Jimp.AUTO)
  .exifRotate()
  .write(x512)

  await upload(bucketName, x1024, filePath.x1024)

  unlink(x1024, err => err)

  unlink(temp, err => err)

  return {
    full: fileName.full,
    x256: fileName.x256,
    x512: fileName.x512,
    x1024: fileName.x1024
  }
}
