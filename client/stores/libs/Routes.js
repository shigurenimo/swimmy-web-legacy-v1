import { Meteor } from 'meteor/meteor'
import { Router } from '@uufish/mst-router'

const documentTitle = document.title
const documentTitleShort = 'swimmy'

const Routes = Router.create()

Routes.setRoute('/(default|self|follows)?', {
  action (stores, {params}) {
    const unique = params[0] || 'default'
    stores.posts.define(unique)
    stores.posts[unique].subscribeFrom(unique)
    stores.timeline.setCurrent({channelId: null, unique: unique})
    stores.routes.setRoute('timeline')
    stores.drawer.close()
    stores.info.close()
    document.title = documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {
        page: '/',
        title: document.title
      })
    }
  }
})

Routes.setRoute('/thread', {
  action (stores, context) {
    stores.threads.subscribe({}, {sort: {createdAt: -1}})
    document.title = 'thread | ' + documentTitle
    stores.routes.setRoute('thread-list')
    stores.drawer.close()
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {
        page: '/thread',
        title: document.title
      })
    }
  }
})

Routes.setRoute('/thread/:_id', {
  action (stores, {params}) {
    stores.posts.define('thread')
    stores.posts.thread.findOne({_id: params._id}, {})
    .then(model => {
      stores.posts.thread.subscribe({
        $or: [
          {_id: params._id},
          {replyId: params._id}
        ]
      })
      stores.timeline.setCurrent({name: 'スレッド'})
      stores.routes.setRoute('thread')
      stores.drawer.close()
      const content = model.content.length > 20
        ? model.content.substr(0, 15) + '..'
        : model.content
      document.title = content + ' | ' + documentTitleShort
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/',
          title: document.title
        })
      }
    })
    .catch(err => { notFound(stores, err) })
  }
})

Routes.setRoute('/storage', {
  action (stores, {params}) {
    const unique = 'storage'
    stores.posts.define(unique)
    stores.posts[unique].subscribeFrom(unique)
    stores.timeline.setCurrent({unique: unique})
    stores.routes.setRoute('storage')
    stores.drawer.close()
    stores.info.close()
    document.title = documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {
        page: '/',
        title: document.title
      })
    }
  }
})

Routes.setRoute('/ch/(default|net|univ)?', {
  action (stores, {params}) {
    const unique = params[0] || 'default'
    stores.drawer.close()
    stores.routes.setRoute('channel-list')
    stores.channels.findFromUnique(unique)
    .then(model => {
      document.title = 'channel | ' + documentTitle
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/ch',
          title: document.title
        })
      }
    })
    .catch(err => {
      notFound(stores, err)
      this.props.snackbar.error(err.reason)
    })
  }
})

Routes.setRoute('/ch/new', {
  action (stores, {params}) {
    stores.routes.setRoute('channel-new')
    stores.drawer.close()
    document.title = 'new channel | ' + documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {
        page: '/ch/new',
        title: document.title
      })
    }
  }
})

Routes.setRoute('/ch/:channelId', {
  action (stores, {params, query}) {
    const channelId = params.channelId
    stores.channels.findOne({_id: channelId})
    .then(model => {
      if (!model) { return notFound(stores) }
      stores.posts.define(channelId)
      stores.posts[channelId].subscribe({channelId})
      stores.timeline.setCurrent({
        channelId: channelId,
        unique: channelId,
        name: model.name
      })
      document.title = model.name + ' | ' + documentTitleShort
      if (query.preview === 'true') {
        stores.info.open()
      } else {
        stores.info.close()
      }
      stores.routes.setRoute('timeline')
      stores.drawer.close()
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/ch/' + channelId,
          title: document.title
        })
      }
    })
    .catch(err => {
      notFound(stores, err)
      this.props.snackbar.error(err.reason)
    })
  }
})

Routes.setRoute('/ch/:channelId/edit', {
  action (stores, {params}) {
    const channelId = params.channelId
    stores.channels.findOne({_id: channelId}, {})
    .then(data => {
      if (!data) { return notFound(stores) }
      stores.routes.setRoute('channel-edit')
      document.title = '編集中 - ' + data.name + ' | ' + documentTitle
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/ch/' + channelId,
          title: document.title
        })
      }
    })
    .catch(err => {
      notFound(stores, err)
      this.props.snackbar.error(err.reason)
    })
  }
})

Routes.setRoute('/admin', {
  action (stores, context) {
    stores.routes.setRoute('admin')
    stores.drawer.close()
    document.title = 'マイページ | ' + documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {
        page: '/admin',
        title: document.title
      })
    }
  }
})

Routes.setRoute('/config', {
  action (stores, context) {
    stores.routes.setRoute('config')
    stores.drawer.close()
    document.title = '各種設定 | ' + documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {
        page: '/config',
        title: document.title
      })
    }
  }
})

Routes.setRoute('/release', {
  action (stores, context) {
    stores.routes.setRoute('release')
    stores.drawer.close()
    document.title = 'リリースノート | ' + documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {
        page: '/release',
        title: document.title
      })
    }
  }
})

Routes.setRoute('/report', {
  action (stores, context) {
    stores.reports.find()
    .then(model => {
      stores.reports.setOne(model)
      stores.routes.setRoute('report')
      stores.drawer.close()
      document.title = '統計データ | ' + documentTitle
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/report',
          title: document.title
        })
      }
    })
  }
})

Routes.setRoute('/twitter', {
  action (stores, {params}) {
    stores.routes.setRoute('twitter')
    stores.drawer.close()
    document.title = 'twitter' + ' | ' + documentTitleShort
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {
        page: '/',
        title: document.title
      })
    }
  }
})

Routes.setRoute('/:username', {
  action (stores, {params}) {
    const username = params.username
    stores.users.findOneFromUsername(username)
    .then(user => {
      if (!user) return notFound(stores)
      stores.users.setOne(user)
      stores.routes.setRoute('profile')
    })
  }
})

function notFound (stores, error) {
  Meteor.call('logs.insert', {
    type: 'page-not-found',
    content: {
      href: window.location.href,
      message: error ? error.message : ''
    }
  })
  stores.routes.setRoute('not-found')
  if (Meteor.isProduction) {
    window.ga('send', 'pageview', {
      page: '/404',
      title: document.title
    })
  }
}

export default Routes
