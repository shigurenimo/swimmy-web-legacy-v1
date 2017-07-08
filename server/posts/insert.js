import { Meteor } from 'meteor/meteor'
import { check } from 'meteor/check'
import { HTTP } from 'meteor/http'
import { Random } from 'meteor/random'
import { unlink, writeFileSync } from 'fs'
import { join } from 'path'
import Jimp from 'jimp'
import cheerio from 'cheerio'
import upload from '/lib/imports/utils/server/google/upload'
import collections from '/lib/collections'
import utils from '/lib/imports/utils'

Meteor.methods({
  async 'posts.insert' (req) {
    check(req.isPublic, Boolean)
    check(req.content, String)

    if (req.images) {
      check(req.images, Array)
    }

    if (!req.images && req.content.length < 1) {
      throw new Meteor.Error('ignore', '入力がありません')
    }

    const date = new Date()

    const url = utils.match.url(req.content)

    let service = null
    if (url) {
      if (url.match(new RegExp('youtube.com'))) {
        service = 'http://www.youtube.com/oembed'
      } else if (url.match(new RegExp('youtu.be'))) {
        service = 'http://www.youtube.com/oembed'
      } else if (url.match(new RegExp('flickr.com'))) {
        service = 'http://www.flickr.com/services/oembed'
      } else if (url.match(new RegExp('flic.kr'))) {
        service = 'http://www.flickr.com/services/oembed'
      } else if (url.match(new RegExp('vimeo.com'))) {
        service = 'http://vimeo.com/api/oembed.json'
      } else if (url.match(new RegExp('slideshare.net'))) {
        service = 'http://www.slideshare.net/api/oembed/2'
      } else if (url.match(new RegExp('soundcloud.com'))) {
        service = 'http://soundcloud.com/oembed'
      }
    }

    let oEmbed = null
    let meta = null
    if (service) {
      oEmbed = oEmbedAsync(url, service)
    } else if (url) {
      meta = metaAsync(url)
    }

    const data = {
      content: req.content,
      reactions: [],
      replies: [],
      channelId: req.channelId || '',
      createdAt: date,
      updatedAt: date,
      from: 'swimmy'
    }

    const tags = utils.match.tags(req.content)
    if (tags) data.tags = tags

    data.ownerId = this.userId

    if (req.isPublic) {
      if (!this.userId) throw new Meteor.Error('not-authorized')
      const user = Meteor.users.findOne(this.userId)
      data.owner = {
        username: user.username
      }
    }

    if (req.images) {
      const image = await uploadImage(date, req.images[0])
      data.images = [image]
    }

    data.extension = {}

    if (url || meta || oEmbed) {
      data.extension.web = {}
    }
    if (url) {
      data.extension.web.url = url
    }
    if (meta) {
      data.extension.web.meta = meta
    }
    if (oEmbed) {
      data.extension.web.oEmbed = oEmbed
    }

    if (req.replyId) {
      check(req.replyId, String)
      const reply = collections.posts.findOne(req.replyId)
      if (reply) {
        data.replyId = reply._id
      } else {
        data.replyId = req.replyId
      }
    }
    const postId = collections.posts.insert(data)

    if (data.replyId) {
      collections.posts.update(data.replyId, {
        $push: {replies: postId},
        $set: {updatedAt: date}
      })
    }

    if (tags) {
      tags.filter(tag => tag !== '').forEach(hashtag => {
        const tag = collections.tags.findOne({name: hashtag})
        if (tag) {
          collections.tags.update(tag._id, {
            $set: {updatedAt: date},
            $inc: {count: 1}
          })
        } else {
          collections.tags.insert({
            name: hashtag,
            updatedAt: date,
            createdAt: date,
            count: 1,
            thread: false,
            threads: []
          })
        }
      })
    }

    return collections.posts.findOne(postId, {
      fields: {
        ownerId: 0
      }
    })
  }
})

const oEmbedAsync = Meteor.wrapAsync((url, service, resolve) => {
  HTTP.get(service, {
    params: {url: url, format: 'json'}
  }, (err, res) => {
    if (err) {
      resolve(null, null)
    } else {
      resolve(null, res.data)
    }
  })
})

const metaAsync = Meteor.wrapAsync((url, resolve) => {
  HTTP.get(url, (err, res) => {
    if (err) {
      resolve(null, null)
      return
    }
    const $ = cheerio.load(res.content, {decodeEntities: false})
    const title = $('title').text()
    const description = $('meta[name=description]')[0]
      ? $('meta[name=description]')[0].attribs.content
      : ''
    const metaData = $('meta')
    const meta = {}
    metaData.each(function () {
      const attribs = $(this)[0].attribs
      const propery = attribs.property
      if (propery && propery.includes('og:')) {
        meta[propery] = attribs.content
      }
    })
    const html = {
      title: title,
      description: description,
      meta: meta
    }
    resolve(null, html)
  })
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

  const bucketName = 'swimmy-images'

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

  unlink(temp, err => err)

  return {
    full: fileName.full,
    x256: fileName.x256,
    x512: fileName.x512,
    x1024: fileName.x512
  }
}
