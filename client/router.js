import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { FlowRouter } from 'meteor/kadira:flow-router'
import stores from './stores'

const documentTitle = document.title
const documentTitleShort = 'swimmy'

FlowRouter.route('/(default|self|follows)?', {
  action (params) {
    stores.posts.closeNetworkInfo()
    stores.router.setRoute('timeline')
    stores.layout.toMain()
    if (params[0]) {
      stores.posts.updateTimelineFromUnique(params[0])
    } else {
      stores.posts.updateTimelineFromUnique('default')
    }
    const timeline = stores.posts.timeline
    if (timeline.isStatic) {
      stores.process.checkin()
      const {selector, options} = timeline
      stores.posts.fetch(selector, options)
      .then(posts => {
        if (posts) {
          stores.posts.insertIndex(posts)
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
})

FlowRouter.route('/timemachine/:y?/:m?/:d?', {
  action (params) {
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
    stores.posts.updateTimelineFromDate(params.y, params.m, params.d)
    const timeline = stores.posts.timeline
    stores.router.setRoute('timemachine')
    stores.layout.toMain()
    stores.process.checkin()
    const {selector, options} = timeline
    stores.posts.fetch(selector, options)
    .then(posts => {
      if (posts) {
        stores.posts.insertIndex(posts)
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
})

FlowRouter.route('/thread', {
  action () {
    stores.router.setRoute('thread-list')
    stores.layout.toMain()
    stores.threads.fetch()
    .then(posts => {
      stores.threads.insertIndex(posts)
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
})

FlowRouter.route('/thread/:_id', {
  action (params) {
    console.log(params._id)
    stores.posts.fetchOneFromId(params._id)
    .then(post => {
      if (!post) {
        return notFound()
      }
      stores.posts.updateOne(post)
      let content = post.content
      if (content.length > 20) {
        content = content.substr(0, 20) + '..'
      }
      stores.router.setRoute('thread')
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
})

FlowRouter.route('/artwork/(default|self|follows)?', {
  action (params) {
    stores.router.setRoute('artwork')
    stores.layout.toMain()
    if (params[0]) {
      stores.artworks.updateTimelineFromUnique(params[0])
    } else {
      stores.artworks.updateTimelineFromUnique('default')
    }
    const {selector, options} = stores.artworks.timeline
    stores.artworks.fetch(selector, options)
    .then(posts => {
      if (posts) {
        stores.artworks.insertIndex(posts)
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
})

FlowRouter.route('/artwork/new', {
  action () {
    stores.router.setRoute('artwork-new')
    stores.layout.toMain()
    document.title = '新しいアートワーク | ' + documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {
        page: '/artwork/new',
        title: document.title
      })
    }
  }
})

FlowRouter.route('/uuid/:_id', {
  action (params) {
    stores.artworks.fetchOneFromId(params._id)
    .then(artwork => {
      if (!artwork) {
        return notFound()
      }
      stores.artworks.updateOne(artwork)
      stores.router.setRoute('artwork-detail')
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
})

FlowRouter.route('/network/(default|net|univ|channel)?', {
  action (params) {
    stores.router.setRoute('network-list')
    stores.layout.toMain()
    if (params[0]) {
      stores.networks.updateTimelineFromUnique(params[0])
    } else {
      stores.networks.updateTimelineFromUnique('default')
    }
    const {selector, options} = stores.networks.timeline
    stores.networks.fetch(selector, options)
    .then(data => {
      stores.networks.insertIndex(data)
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
})

FlowRouter.route('/network/new', {
  action () {
    stores.router.setRoute('network-new')
    stores.layout.toMain()
    document.title = '新しいリスト | ' + documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {
        page: '/network/new',
        title: document.title
      })
    }
  }
})

FlowRouter.route('/room/:networkId', {
  action (params, query) {
    const networkId = params.networkId
    stores.networks.fetchOne({_id: networkId}, {})
    .then(network => {
      if (!network) {
        return notFound()
      }
      stores.networks.updateOne(network)
      const timeline = stores.posts.updatetTempTimelineFromNetwork(network)
      stores.posts.updateTimeline(timeline)
      stores.posts.resetTimelines()
      stores.postsSocket.subscribe(timeline)
      if (query.preview === 'true') {
        stores.posts.openNetworkInfo()
      } else {
        stores.posts.closeNetworkInfo()
      }
      stores.router.setRoute('timeline')
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
})

FlowRouter.route('/network/:networkId/edit', {
  action (params) {
    const networkId = params.networkId
    stores.networks.fetchOne({_id: networkId}, {})
    .then(data => {
      if (!data) {
        return notFound()
      }
      stores.networks.updateOne(data)
      stores.router.setRoute('network-edit')
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
})

FlowRouter.route('/verify-email/:token', {
  action (params) {
    const token = params.token
    stores.router.setRoute('verify')
    Accounts.verifyEmail(token, error => {
      if (error) {
        stores.router.verifyError = true
      } else {
        stores.router.verifyError = false
      }
    })
  }
})

FlowRouter.route('/admin', {
  action () {
    stores.router.setRoute('admin')
    stores.layout.toMain()
    document.title = 'マイページ | ' + documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {
        page: '/admin',
        title: document.title
      })
    }
  }
})

FlowRouter.route('/config', {
  action () {
    stores.router.setRoute('config')
    stores.layout.toMain()
    document.title = '各種設定 | ' + documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {
        page: '/config',
        title: document.title
      })
    }
  }
})

FlowRouter.route('/release', {
  action () {
    stores.router.setRoute('release')
    stores.layout.toMain()
    document.title = 'リリースノート | ' + documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {
        page: '/release',
        title: document.title
      })
    }
  }
})

FlowRouter.route('/report', {
  action () {
    stores.reports.fetch()
    .then(report => {
      stores.reports.updateIndex(report)
      stores.router.setRoute('report')
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
})

FlowRouter.route('/:username', {
  action (params) {
    const username = params.username
    stores.userOther.fetchOneFromUsername(username)
    .then(user => {
      if (!user) return notFound()
      stores.userOther.updateOne(user)
      stores.router.setRoute('profile')
      return stores.posts.fetchFromUserId(user._id)
    })
    .then(posts => {
      stores.posts.insertIndex(posts)
    })
    .catch(err => { stores.snackbar.error(err) })
  }
})

function notFound () {
  stores.router.setRoute('not-found')
  document.title = '404 | ' + documentTitle
  if (Meteor.isProduction) {
    window.ga('send', 'pageview', {
      page: '/404',
      title: document.title
    })
  }
}

FlowRouter.wait()

if (Accounts.userId()) {
  Accounts.onLogin(() => {
    if (!FlowRouter._initialized) {
      FlowRouter.initialize()
    }
  })
} else {
  FlowRouter.initialize()
}
