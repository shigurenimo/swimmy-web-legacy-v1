import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

const documentTitle = document.title
const documentTitleShort = 'swimmy'

export default {
  '/(default|self|follows)?': {
    async action ({params}, stores) {
      stores.posts.closeNetworkInfo()
      stores.routes.setRoute('timeline')
      stores.layout.toMain()
      if (params[0]) {
        stores.posts.setTimelineFromUnique(params[0])
      } else {
        stores.posts.setTimelineFromUnique('default')
      }
      const timeline = stores.posts.timeline
      if (timeline.isStatic) {
        stores.process.checkin()
        const {selector, options} = timeline
        stores.posts.find(selector, options)
        .then(posts => {
          if (posts) {
            stores.posts.pushIndex(posts)
          }
          stores.process.checkout()
        })
        .catch(err => { stores.snackbar.error(err) })
      } else {
        stores.postsSocket.subscribe(timeline)
      }
      document.title = documentTitle
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/',
          title: document.title
        })
      }
    }
  },
  '/timemachine/:y?/:m?/:d?': {
    async action ({params}, stores) {
      if (params.d === undefined) {
        const date = new Date()
        params.y = date.getFullYear()
        params.m = date.getMonth() + 1
        params.d = date.getDate()
      } else {
        params.y = parseInt(params.y)
        params.m = parseInt(params.m)
        params.d = parseInt(params.d)
      }
      stores.posts.setTimelineFromDate(params.y, params.m, params.d)
      const timeline = stores.posts.timeline
      stores.routes.setRoute('timemachine')
      stores.layout.toMain()
      stores.process.checkin()
      const {selector, options} = timeline
      stores.posts.find(selector, options)
      .then(posts => {
        if (posts) {
          stores.posts.pushIndex(posts)
        }
        stores.process.checkout()
      })
      .catch(err => { stores.snackbar.error(err) })
      document.title = documentTitle
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/',
          title: document.title
        })
      }
    }
  },
  '/thread': {
    async action (context, stores) {
      stores.routes.setRoute('thread-list')
      stores.layout.toMain()
      stores.threads.find()
      .then(posts => {
        stores.threads.pushIndex(posts)
        document.title = '最近のスレッド | ' + documentTitle
      })
      .catch(err => { stores.snackbar.error(err) })
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/thread',
          title: document.title
        })
      }
    }
  },
  '/thread/:_id': {
    async action ({params}, stores) {
      stores.posts.findOneFromId(params._id)
      .then(post => {
        if (!post) {
          return notFound()
        }
        stores.posts.replaceOne(post)
        let content = post.content
        if (content.length > 20) {
          content = content.substr(0, 20) + '..'
        }
        stores.routes.setRoute('thread')
        stores.layout.toMain()
        document.title = content + ' | ' + documentTitleShort
        if (Meteor.isProduction) {
          window.ga('send', 'pageview', {
            page: '/',
            title: document.title
          })
        }
      })
      .catch(err => { stores.snackbar.error(err) })
    }
  },
  '/artwork/(default|self|follows)?': {
    async action ({params}, stores) {
      stores.routes.setRoute('artwork')
      stores.layout.toMain()
      if (params[0]) {
        stores.artworks.setTimelineFromUnique(params[0])
      } else {
        stores.artworks.setTimelineFromUnique('default')
      }
      const {selector, options} = stores.artworks.timeline
      stores.artworks.find(selector, options)
      .then(posts => {
        if (posts) {
          stores.artworks.pushIndex(posts)
        }
        document.title = 'アートワーク | ' + documentTitle
        if (Meteor.isProduction) {
          window.ga('send', 'pageview', {
            page: '/artwork',
            title: document.title
          })
        }
      })
      .catch(err => { stores.snackbar.error(err) })
    }
  },
  '/artwork/new': {
    async action (context, stores) {
      stores.routes.setRoute('artwork-new')
      stores.layout.toMain()
      document.title = '新しいアートワーク | ' + documentTitle
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/artwork/new',
          title: document.title
        })
      }
    }
  },
  '/uuid/:_id': {
    async action ({params}, stores) {
      stores.artworks.findOneFromId(params._id)
      .then(artwork => {
        if (!artwork) {
          return notFound()
        }
        stores.artworks.replaceOne(artwork)
        stores.routes.setRoute('artwork-detail')
        const title = artwork.title ? artwork.title : artwork._id
        document.title = title + ' | ' + documentTitleShort
        if (Meteor.isProduction) {
          window.ga('send', 'pageview', {
            page: '/uuid/' + artwork._id,
            title: document.title
          })
        }
      })
      .catch(err => { stores.snackbar.error(err) })
    }
  },
  '/network/(default|net|univ|channel)?': {
    async action ({params}, stores) {
      stores.routes.setRoute('network-list')
      stores.layout.toMain()
      if (params[0]) {
        stores.networks.setTimelineFromUnique(params[0])
      } else {
        stores.networks.setTimelineFromUnique('default')
      }
      const {selector, options} = stores.networks.timeline
      stores.networks.find(selector, options)
      .then(data => {
        stores.networks.pushIndex(data)
        document.title = 'リスト | ' + documentTitle
        if (Meteor.isProduction) {
          window.ga('send', 'pageview', {
            page: '/network',
            title: document.title
          })
        }
      })
      .catch(err => { stores.snackbar.error(err) })
    }
  },
  '/network/new': {
    async action ({params}, stores) {
      stores.routes.setRoute('network-new')
      stores.layout.toMain()
      document.title = '新しいリスト | ' + documentTitle
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/network/new',
          title: document.title
        })
      }
    }
  },
  '/room/:networkId': {
    async action ({params, query}, stores) {
      const networkId = params.networkId
      stores.networks.findOne({_id: networkId}, {})
      .then(network => {
        if (!network) {
          return notFound()
        }
        stores.networks.replaceOne(network)
        const timeline = stores.posts.setTempTimelineFromNetwork(network)
        stores.posts.setTimeline(timeline)
        stores.posts.resetTimelines()
        stores.postsSocket.subscribe(timeline)
        if (query.preview === 'true') {
          stores.posts.openNetworkInfo()
        } else {
          stores.posts.closeNetworkInfo()
        }
        stores.routes.setRoute('timeline')
        stores.layout.toMain()
        document.title = network.name + ' | ' + documentTitleShort
        if (Meteor.isProduction) {
          window.ga('send', 'pageview', {
            page: '/room/' + networkId,
            title: document.title
          })
        }
      })
      .catch(err => { stores.snackbar.error(err) })
    }
  },
  '/network/:networkId/edit': {
    async action ({params}, stores) {
      const networkId = params.networkId
      stores.networks.findOne({_id: networkId}, {})
      .then(data => {
        if (!data) {
          return notFound()
        }
        stores.networks.replaceOne(data)
        stores.routes.setRoute('network-edit')
        document.title = '編集中 - ' + data.name + ' | ' + documentTitle
        if (Meteor.isProduction) {
          window.ga('send', 'pageview', {
            page: '/network/' + networkId,
            title: document.title
          })
        }
      })
      .catch(err => { stores.snackbar.error(err) })
    }
  },
  '/verify-email/:token': {
    async action ({params}, stores) {
      const token = params.token
      stores.routes.setRoute('verify')
      Accounts.verifyEmail(token, error => {
        if (error) {
          stores.router.verifyError = true
        } else {
          stores.router.verifyError = false
        }
      })
    }
  },
  '/admin': {
    async action (context, stores) {
      stores.routes.setRoute('admin')
      stores.layout.toMain()
      document.title = 'マイページ | ' + documentTitle
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/admin',
          title: document.title
        })
      }
    }
  },
  '/config': {
    async action (context, stores) {
      stores.routes.setRoute('config')
      stores.layout.toMain()
      document.title = '各種設定 | ' + documentTitle
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/config',
          title: document.title
        })
      }
    }
  },
  '/release': {
    async action (context, stores) {
      stores.routes.setRoute('release')
      stores.layout.toMain()
      document.title = 'リリースノート | ' + documentTitle
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/release',
          title: document.title
        })
      }
    }
  },
  '/report': {
    async action (context, stores) {
      stores.reports.find()
      .then(report => {
        stores.reports.setIndex(report)
        stores.routes.setRoute('report')
        stores.layout.toMain()
        document.title = 'レポート | ' + documentTitle
        if (Meteor.isProduction) {
          window.ga('send', 'pageview', {
            page: '/report',
            title: document.title
          })
        }
      })
      .catch(err => { stores.snackbar.error(err) })
    }
  },
  '/twitter': {
    async action ({params}, stores) {
      stores.routes.setRoute('twitter')
      stores.layout.toMain()
      document.title = 'twitter' + ' | ' + documentTitleShort
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/',
          title: document.title
        })
      }
    }
  },
  '/:username': {
    action ({params}, stores) {
      const username = params.username
      stores.usersProfile.findOneFromUsername(username)
      .then(user => {
        if (!user) return notFound()
        stores.usersProfile.setOne(user)
        stores.routes.setRoute('profile')
        return stores.posts.findFromUserId(user._id)
      })
      .then(posts => {
        stores.posts.pushIndex(posts)
      })
      .catch(err => { stores.snackbar.error(err) })
    }
  }
}

function notFound (stores) {
  stores.routes.setRoute('not-found')
  document.title = '404 | ' + documentTitle
  if (Meteor.isProduction) {
    window.ga('send', 'pageview', {
      page: '/404',
      title: document.title
    })
  }
}
