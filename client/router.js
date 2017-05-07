import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { injections } from './injections'

const documentTitle = document.title
const documentTitleShort = 'swimmy'

FlowRouter.route('/(default|self|follows)?', {
  action (params) {
    injections.posts.closeNetworkInfo()
    injections.router.setRoute('timeline')
    injections.layout.toMain()
    if (params[0]) {
      injections.posts.updateTimelineFromUnique(params[0])
    } else {
      injections.posts.updateTimelineFromUnique('default')
    }
    const timeline = injections.posts.timeline
    if (timeline.isStatic) {
      injections.process.checkin()
      const {selector, options} = timeline
      injections.posts.fetch(selector, options)
      .then(posts => {
        if (posts) {
          injections.posts.insertIndex(posts)
        }
        injections.process.checkout()
      })
      .catch(err => { injections.snackbar.error(err) })
    } else {
      injections.postsSocket.subscribe(timeline)
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
    injections.posts.updateTimelineFromDate(params.y, params.m, params.d)
    const timeline = injections.posts.timeline
    injections.router.setRoute('timemachine')
    injections.layout.toMain()
    injections.process.checkin()
    const {selector, options} = timeline
    injections.posts.fetch(selector, options)
    .then(posts => {
      if (posts) {
        injections.posts.insertIndex(posts)
      }
      injections.process.checkout()
    })
    .catch(err => { injections.snackbar.error(err) })
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
    injections.router.setRoute('thread-list')
    injections.layout.toMain()
    injections.threads.fetch()
    .then(posts => {
      injections.threads.insertIndex(posts)
      document.title = '最近のスレッド | ' + documentTitle
    })
    .catch(err => { injections.snackbar.error(err) })
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
    injections.posts.fetchOneFromId(params._id)
    .then(post => {
      if (!post) {
        return notFound()
      }
      injections.posts.updateOne(post)
      let content = post.content
      if (content.length > 20) {
        content = content.substr(0, 20) + '..'
      }
      injections.router.setRoute('thread')
      injections.layout.toMain()
      document.title = content + ' | ' + documentTitleShort
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/',
          title: document.title
        })
      }
    })
    .catch(err => { injections.snackbar.error(err) })
  }
})

FlowRouter.route('/artwork/(default|self|follows)?', {
  action (params) {
    injections.router.setRoute('artwork')
    injections.layout.toMain()
    if (params[0]) {
      injections.artworks.updateTimelineFromUnique(params[0])
    } else {
      injections.artworks.updateTimelineFromUnique('default')
    }
    const {selector, options} = injections.artworks.timeline
    injections.artworks.fetch(selector, options)
    .then(posts => {
      if (posts) {
        injections.artworks.insertIndex(posts)
      }
      document.title = 'アートワーク | ' + documentTitle
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/artwork',
          title: document.title
        })
      }
    })
    .catch(err => { injections.snackbar.error(err) })
  }
})

FlowRouter.route('/artwork/new', {
  action () {
    injections.router.setRoute('artwork-new')
    injections.layout.toMain()
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
    injections.artworks.fetchOneFromId(params._id)
    .then(artwork => {
      if (!artwork) {
        return notFound()
      }
      injections.artworks.updateOne(artwork)
      injections.router.setRoute('artwork-detail')
      const title = artwork.title ? artwork.title : artwork._id
      document.title = title + ' | ' + documentTitleShort
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/uuid/' + artwork._id,
          title: document.title
        })
      }
    })
    .catch(err => { injections.snackbar.error(err) })
  }
})

FlowRouter.route('/network/(default|net|univ|channel)?', {
  action (params) {
    injections.router.setRoute('network-list')
    injections.layout.toMain()
    if (params[0]) {
      injections.networks.updateTimelineFromUnique(params[0])
    } else {
      injections.networks.updateTimelineFromUnique('default')
    }
    const {selector, options} = injections.networks.timeline
    injections.networks.fetch(selector, options)
    .then(data => {
      injections.networks.insertIndex(data)
      document.title = 'リスト | ' + documentTitle
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/network',
          title: document.title
        })
      }
    })
    .catch(err => { injections.snackbar.error(err) })
  }
})

FlowRouter.route('/network/new', {
  action () {
    injections.router.setRoute('network-new')
    injections.layout.toMain()
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
    injections.networks.fetchOne({_id: networkId}, {})
    .then(network => {
      if (!network) {
        return notFound()
      }
      injections.networks.updateOne(network)
      const timeline = injections.posts.updatetTempTimelineFromNetwork(network)
      injections.posts.updateTimeline(timeline)
      injections.posts.resetTimelines()
      injections.postsSocket.subscribe(timeline)
      if (query.preview === 'true') {
        injections.posts.openNetworkInfo()
      } else {
        injections.posts.closeNetworkInfo()
      }
      injections.router.setRoute('timeline')
      injections.layout.toMain()
      document.title = network.name + ' | ' + documentTitleShort
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/room/' + networkId,
          title: document.title
        })
      }
    })
    .catch(err => { injections.snackbar.error(err) })
  }
})

FlowRouter.route('/network/:networkId/edit', {
  action (params) {
    const networkId = params.networkId
    injections.networks.fetchOne({_id: networkId}, {})
    .then(data => {
      if (!data) {
        return notFound()
      }
      injections.networks.updateOne(data)
      injections.router.setRoute('network-edit')
      document.title = '編集中 - ' + data.name + ' | ' + documentTitle
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/network/' + networkId,
          title: document.title
        })
      }
    })
    .catch(err => { injections.snackbar.error(err) })
  }
})

FlowRouter.route('/verify-email/:token', {
  action (params) {
    const token = params.token
    injections.router.setRoute('verify')
    Accounts.verifyEmail(token, error => {
      if (error) {
        injections.router.verifyError = true
      } else {
        injections.router.verifyError = false
      }
    })
  }
})

FlowRouter.route('/admin', {
  action () {
    injections.router.setRoute('admin')
    injections.layout.toMain()
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
    injections.router.setRoute('config')
    injections.layout.toMain()
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
    injections.router.setRoute('release')
    injections.layout.toMain()
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
    injections.reports.fetch()
    .then(report => {
      injections.reports.updateIndex(report)
      injections.router.setRoute('report')
      injections.layout.toMain()
      document.title = 'レポート | ' + documentTitle
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/report',
          title: document.title
        })
      }
    })
    .catch(err => { injections.snackbar.error(err) })
  }
})

FlowRouter.route('/:username', {
  action (params) {
    const username = params.username
    injections.userOther.fetchOneFromUsername(username)
    .then(user => {
      if (!user) return notFound()
      injections.userOther.updateOne(user)
      injections.router.setRoute('profile')
      return injections.posts.fetchFromUserId(user._id)
    })
    .then(posts => {
      injections.posts.insertIndex(posts)
    })
    .catch(err => { injections.snackbar.error(err) })
  }
})

function notFound () {
  injections.router.setRoute('not-found')
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
