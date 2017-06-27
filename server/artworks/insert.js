import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { Random } from 'meteor/random'
import { unlink, writeFileSync } from 'fs'
import Jimp from 'jimp'
import makePublic from '/utils/server/google/makePublic'
import upload from '/utils/server/google/upload'
import collections from '/collections'

// 挿入する
Meteor.methods({
  async 'artworks.insert' (req) {
    const userId = this.userId
    const address = this.connection.clientAddress

    check(req.isPublic, Boolean)
    check(req.isSecret, Boolean)
    check(req.title, String)
    check(req.note, String)
    check(req.tags, Array)

    const date = new Date()

    if (!userId) {
      throw new Meteor.Error('not-authorized')
    }

    const image = await uploadImage(date, req.image)

    const data = {
      owner: userId,
      addr: address,
      secret: req.isSecret,
      type: req.type,
      title: req.title,
      note: req.note,
      colors: req.colors,
      rate: req.rate,
      tags: req.tags,
      image: image,
      reactions: {'スキ': []},
      replies: [],
      from: 'swimmy',
      createdAt: date,
      updatedAt: date
    }

    if (req.isPublic) {
      if (!userId) throw new Meteor.Error('not-authorized')
      const user = Meteor.users.findOne(userId)
      data.public = {
        username: user.username,
        name: user.profile.name,
        icon: ''
      }
    }

    const postId = collections.artworks.insert(data)
    return collections.artworks.findOne(postId)
  }
})

async function uploadImage (date, base64) {
  const buf = Buffer.from(base64, 'base64')

  const ext = '.jpg'
  const name = Random.id()

  const temp = require('path').join(process.env.PWD, '.temp', name + ext)

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
    full: require('path').join(datePath, fileName.full),
    x128: require('path').join(datePath, fileName.x128),
    x256: require('path').join(datePath, fileName.x256),
    x512: require('path').join(datePath, fileName.x512),
    x1024: require('path').join(datePath, fileName.x1024)
  }

  await upload(bucketName, temp, filePath.full)

  // x512
  const x512 = require('path').join(process.env.PWD, '.temp', fileName.x512)
  const ref = await Jimp.read(temp)
  ref.resize(512, Jimp.AUTO)
  .exifRotate()
  .write(x512)

  await upload(bucketName, x512, filePath.x512)

  await makePublic(bucketName, [
    filePath.full,
    filePath.x512
  ])

  unlink(x512, err => err)

  // other
  const other = [
    {name: 'x128', size: 128},
    {name: 'x256', size: 256},
    {name: 'x1024', size: 1024}
  ]
  let count = other.length
  other.forEach(async ({name, size}) => {
    const dist = require('path').join(process.env.PWD, '.temp', fileName[name])
    const ref = await Jimp.read(temp)
    ref.resize(size, Jimp.AUTO)
    .exifRotate()
    .write(dist)
    await upload(bucketName, dist, filePath[name])
    await makePublic(bucketName, [filePath[name]])
    unlink(dist, err => err)
    count = count - 1
    if (count < 1) {
      unlink(temp, err => err)
    }
  })

  return {
    full: fileName.full,
    x128: fileName.x128,
    x256: fileName.x256,
    x512: fileName.x512,
    x1024: fileName.x1024
  }
}
