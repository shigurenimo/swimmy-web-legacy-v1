import { Meteor } from 'meteor/meteor'
import { Random } from 'meteor/random'
import { unlink, writeFileSync } from 'fs'
import Jimp from 'jimp'
import makePublic from '/utils/server/google/makePublic'
import upload from '/utils/server/google/upload'

Meteor.methods({
  async 'posts.uploadImages' (base64Array) {
    const buf = new Buffer(base64Array[0], 'base64')

    const ext = '.jpg'
    const name = Random.id()

    const temp = require('path').join(process.env.PWD, '.temp', name + ext)

    writeFileSync(temp, buf)

    const fileName = {
      full: name + '.full' + ext,
      min: name + '.min' + ext
    }

    const bucketName = 'swimmy-images'

    const date = new Date()

    const datePath = [
      date.getFullYear(),
      ('00' + (date.getMonth() + 1)).slice(-2),
      ('00' + date.getDate()).slice(-2)
    ].join('-')

    const filePath = {
      full: require('path').join(datePath, fileName.full),
      min: require('path').join(datePath, fileName.min)
    }

    await upload(bucketName, temp, filePath.full)

    const min = require('path').join(process.env.PWD, '.temp', fileName.min)

    const lenna = await Jimp.read(temp)
    lenna
    .resize(256, Jimp.AUTO)
    .exifRotate()
    .write(min)

    await upload(bucketName, min, filePath.min)

    await makePublic(bucketName, [
      filePath.full,
      filePath.min
    ])

    unlink(temp, err => err)

    unlink(min, err => err)

    const baseUrl = 'https://storage.cloud.google.com'

    console.log([
      require('path').join(baseUrl, bucketName, filePath.full),
      require('path').join(baseUrl, bucketName, filePath.min)
    ])
  }
})
