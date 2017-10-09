import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import cheerio from 'cheerio'
import utils from '/imports/utils'

export default function (content, date) {
  const url = utils.match.url(content)

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

  let html = url ? metaAsync(url) : null

  let oEmbed = service ? oEmbedAsync(url, service) : null

  if (!url && !html && !oEmbed) return null

  const web = {}

  if (url) {
    web.url = url
  }
  if (html) {
    web.html = html
  }
  if (oEmbed) {
    web.oEmbed = oEmbed
  }

  return web
}

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
