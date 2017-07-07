import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

const documentTitle = document.title
const documentTitleShort = 'swimmy'

export default {
  '/(default|self|follows)?': {
    async action ({params}, stores) {
      const unique = params[0] || 'default'
      stores.posts.define(unique)
      stores.posts[unique].subscribeFromUnique()
      stores.timelines.setCurrent({
        useSocket: true,
        networkId: null,
        unique: unique
      })
      stores.routes.setRoute('timeline')
      stores.layout.setMain()
      stores.info.close()
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
      stores.threads.subscribe()
      document.title = 'thread | ' + documentTitle
      stores.routes.setRoute('thread-list')
      stores.layout.setMain()
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
        if (!post) { return notFound() }
        stores.posts.replaceOne(post)
        let content = post.content
        if (content.length > 20) {
          content = content.substr(0, 20) + '..'
        }
        stores.routes.setRoute('thread')
        stores.layout.setMain()
        document.title = content + ' | ' + documentTitleShort
        if (Meteor.isProduction) {
          window.ga('send', 'pageview', {
            page: '/',
            title: document.title
          })
        }
      })
    }
  },
  '/artwork/(default|self|follows)?': {
    async action ({params}, stores) {
      stores.routes.setRoute('artwork')
      stores.layout.setMain()
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
      .catch(err => this.props.snackbar.error(err.reason))
    }
  },
  '/artwork/new': {
    async action (context, stores) {
      stores.routes.setRoute('artwork-new')
      stores.layout.setMain()
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
      .catch(err => this.props.snackbar.error(err.reason))
    }
  },
  '/network/(default|net|univ)?': {
    async action ({params}, stores) {
      stores.layout.setMain()
      stores.routes.setRoute('network-list')
      stores.networks.findFromTemplate(params[0])
      .then(data => {
        stores.networks.pushIndex(data)
        document.title = 'channel | ' + documentTitle
        if (Meteor.isProduction) {
          window.ga('send', 'pageview', {
            page: '/network',
            title: document.title
          })
        }
      })
      .catch(err => this.props.snackbar.error(err.reason))
    }
  },
  '/network/new': {
    async action ({params}, stores) {
      stores.routes.setRoute('network-new')
      stores.layout.setMain()
      document.title = 'new channel | ' + documentTitle
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/network/new',
          title: document.title
        })
      }
    }
  },
  '/channel/:networkId': {
    async action ({params, query}, stores) {
      const networkId = params.networkId
      stores.networks.findOne({_id: networkId}, {})
      .then(network => {
        if (!network) { return notFound() }
        stores.networks.replaceOne(network)
        stores.postsSocket.subscribeFromNetworkId(networkId)
        stores.timelines.setCurrent({
          useSocket: true,
          networkId: networkId
        })
        console.log(stores.timelines)
        /*
         if (query.preview === 'true') {
         stores.info.open()
         } else {
         stores.info.close()
         }
         */
        stores.routes.setRoute('timeline')
        stores.layout.setMain()
        document.title = network.name + ' | ' + documentTitleShort
        if (Meteor.isProduction) {
          window.ga('send', 'pageview', {
            page: '/channel/' + networkId,
            title: document.title
          })
        }
      })
      .catch(err => this.props.snackbar.error(err.reason))
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
      .catch(err => this.props.snackbar.error(err.reason))
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
      stores.layout.setMain()
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
      stores.layout.setMain()
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
      stores.layout.setMain()
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
      .then(model => {
        stores.reports.setOne(model)
        stores.routes.setRoute('report')
        stores.layout.setMain()
        document.title = '統計データ | ' + documentTitle
        if (Meteor.isProduction) {
          window.ga('send', 'pageview', {
            page: '/report',
            title: document.title
          })
        }
      })
    }
  },
  '/twitter': {
    async action ({params}, stores) {
      stores.routes.setRoute('twitter')
      stores.layout.setMain()
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
    async action ({params}, stores) {
      const username = params.username
      stores.users.findOneFromUsername(username)
      .then(user => {
        if (!user) return notFound()
        stores.users.setOne(user)
        stores.routes.setRoute('profile')
        return stores.posts.findFromUserId(user._id)
      })
      .then(posts => {
        stores.posts.setIndex(posts)
      })
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
