import { Meteor } from 'meteor/meteor'
import { Router } from '/client/imports/packages/routes'

const documentTitle = document.title
const documentTitleShort = 'swimmy'

const Routes = Router.createState()

Routes.setRoute('/(default|self|follows)?', {
  async action (stores, {params}) {
    const unique = params[0] || 'default'
    stores.posts.define(unique)
    try {
      stores.posts[unique].subscribeFromUnique(unique)
      stores.timelines.setCurrent({
        useSocket: true,
        channelId: null,
        unique: unique
      })
      stores.routes.setRoute('timeline')
      stores.drawer.close()
      stores.info.close()
    } catch (err) {
      console.log(err)
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

Routes.setRoute('/thread', {
  async action (stores, context) {
    stores.threads.subscribe()
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
  async action (stores, {params}) {
    stores.posts.define('thread')
    stores.posts.thread.findOne({_id: params._id}, {})
    .then(model => {
      stores.posts.thread.subscribe({
        $or: [
          {_id: params._id},
          {replyId: params._id}
        ]
      })
      const content = model.content.length > 20
        ? model.content.substr(0, 15) + '..'
        : model.content
      stores.routes.setRoute('thread')
      stores.drawer.close()
      document.title = content + ' | ' + documentTitleShort
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/',
          title: document.title
        })
      }
    })
    .catch(() => {
      notFound(stores)
    })
  }
})

Routes.setRoute('/uuid/:_id', {
  async action (stores, {params}) {
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
})

Routes.setRoute('/ch/(default|net|univ)?', {
  async action (stores, {params}) {
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
    .catch(err => this.props.snackbar.error(err.reason))
  }
})

Routes.setRoute('/ch/new', {
  async action (stores, {params}) {
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
  async action (stores, {params, query}) {
    const channelId = params.channelId
    stores.channels.findOne({_id: channelId})
    .then(model => {
      if (!model) { return notFound() }
      stores.posts.define(channelId)
      stores.posts[channelId].subscribe({channelId})
      stores.timelines.setCurrent({
        useSocket: true,
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
    .catch(err => this.props.snackbar.error(err.reason))
  }
})

Routes.setRoute('/ch/:channelId/edit', {
  async action (stores, {params}) {
    const channelId = params.channelId
    stores.channels.findOne({_id: channelId}, {})
    .then(data => {
      if (!data) { return notFound() }
      stores.routes.setRoute('channel-edit')
      document.title = '編集中 - ' + data.name + ' | ' + documentTitle
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {
          page: '/ch/' + channelId,
          title: document.title
        })
      }
    })
    .catch(err => this.props.snackbar.error(err.reason))
  }
})

Routes.setRoute('/admin', {
  async action (stores, context) {
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
  async action (stores, context) {
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
  async action (stores, context) {
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
  async action (stores, context) {
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
  async action (stores, {params}) {
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
  async action (stores, {params}) {
    const username = params.username
    stores.users.findOneFromUsername(username)
    .then(user => {
      if (!user) return notFound()
      stores.users.setOne(user)
      stores.routes.setRoute('profile')
    })
  }
})

function notFound (stores) {
  stores.routes.setRoute('not-found')
  if (Meteor.isProduction) {
    window.ga('send', 'pageview', {
      page: '/404',
      title: document.title
    })
  }
}

export default Routes
