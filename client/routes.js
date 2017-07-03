import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

const documentTitle = document.title
const documentTitleShort = 'swimmy'

export default {
  '/(default|self|follows)?': {
    async action ({params}, stores) {
      if (stores.accounts.isLogged) {
        stores.timelines.setFromUnique(params[0])
      } else {
        stores.timelines.setFromUnique()
      }
      const selector = stores.timelines.one.getSelector()
      const options = stores.timelines.one.getOptions()
      if (stores.timelines.one.isStatic) {
        stores.posts.find(selector, options)
        .then(posts => {
          stores.posts.setIndex(posts)
        })
      } else {
        stores.postsSocket.subscribe(selector, options)
      }
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
  '/logs/:y?/:m?/:d?': {
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
      stores.timelines.setFromDate(params.y, params.m, params.d)
      const selector = stores.timelines.one.getSelector()
      const options = stores.timelines.one.getOptions()
      stores.posts.find(selector, options)
      .then(posts => {
        if (posts) {
          stores.posts.setIndex(posts)
        }
      })
      stores.routes.setRoute('logs')
      stores.layout.setMain()
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
      stores.threads.find()
      .then(posts => {
        stores.threads.setIndex(posts)
        document.title = 'thread | ' + documentTitle
      })
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
  '/network/(default|net|univ|channel)?': {
    async action ({params}, stores) {
      stores.routes.setRoute('network-list')
      stores.layout.setMain()
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
      .catch(err => this.props.snackbar.error(err.reason))
    }
  },
  '/network/new': {
    async action ({params}, stores) {
      stores.routes.setRoute('network-new')
      stores.layout.setMain()
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
        stores.timelines.setTemp(network._id)
        stores.timelines.setFromUnique(network._id)
        const selector = stores.timelines.one.getSelector()
        const options = stores.timelines.one.getOptions()
        stores.postsSocket.subscribe(selector, options)
        try {
          if (query.preview === 'true') {
            stores.info.open()
          } else {
            stores.info.close()
          }
          stores.routes.setRoute('timeline')
          stores.layout.setMain()
        } catch (err) {
          console.log(err)
        }
        document.title = network.name + ' | ' + documentTitleShort
        if (Meteor.isProduction) {
          window.ga('send', 'pageview', {
            page: '/room/' + networkId,
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
