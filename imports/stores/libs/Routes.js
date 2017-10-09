import { Meteor } from 'meteor/meteor'
import { Router } from '@uufish/mst-router'

const documentTitle = document.title
const documentTitleShort = 'swimmy'

const Routes = Router.create()

Routes.setRoute('/(default)?', {
  action (stores, {path}) {
    stores.posts.model.set('root')
    stores.posts.model.get('root').find({}, {limit: 50})
    stores.timeline.setCurrent({channelId: null, unique: 'root'})
    stores.routes.setRoute('timeline')
    stores.drawer.close()
    stores.info.close()
    document.title = documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {page: path, title: document.title})
    }
  }
})

Routes.setRoute('/self', {
  action (stores, {path}) {
    stores.posts.model.set('self')
    stores.posts.model.get('self').find({ownerId: Meteor.userId()}, {limit: 50})
    stores.timeline.setCurrent({channelId: null, unique: 'self'})
    stores.routes.setRoute('timeline')
    stores.drawer.close()
    stores.info.close()
    document.title = documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {page: path, title: document.title})
    }
  }
})

Routes.setRoute('/explore', {
  action (stores, {path, query}) {
    stores.posts.model.set('explore')
    if (query.word) {
      stores.posts.model.get('explore').find({content: '/' + query.word + '/'})
    }
    stores.routes.setRoute('explore')
    stores.drawer.close()
    stores.info.close()
    document.title = documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {page: path, title: document.title})
    }
  }
})

Routes.setRoute('/bucket', {
  action (stores, {path, query}) {
    stores.routes.setRoute('bucket-list')
    stores.buckets.model.get('root').find({}, {})
    stores.drawer.close()
    stores.info.close()
    document.title = documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {page: path, title: document.title})
    }
  }
})

Routes.setRoute('/thread', {
  action (stores, {path}) {
    try {
      stores.threads.model.get('root').find({}, {sort: {createdAt: -1}})
      document.title = 'thread | ' + documentTitle
      stores.routes.setRoute('thread-list')
      stores.drawer.close()
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {page: path, title: document.title})
      }
    } catch (e) { console.info(e) }
  }
})

Routes.setRoute('/thread/:_id', {
  action (stores, {path, params}) {
    stores.posts.findOne({_id: params._id}, {})
    .then(model => {
      stores.posts.model.set('thread')
      stores.posts.model.get('thread').find({
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
    })
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {page: path, title: document.title})
    }
  }
})

Routes.setRoute('/storage', {
  action (stores, {path, params}) {
    const unique = 'storage'
    stores.posts.model.set(unique)
    stores.posts.model.get(unique).find({'images': {$exists: true}}, {limit: 50})
    stores.timeline.setCurrent({unique: unique})
    stores.routes.setRoute('storage')
    stores.drawer.close()
    stores.info.close()
    document.title = documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {page: path, title: document.title})
    }
  }
})

Routes.setRoute('/ch', {
  action (stores, {path, params}) {
    stores.drawer.close()
    stores.routes.setRoute('channel-list')
    stores.channels.model.get('root').find({}, {})
    document.title = 'channel | ' + documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {page: path, title: document.title})
    }
  }
})

Routes.setRoute('/ch/new', {
  action (stores, {path, params}) {
    stores.routes.setRoute('channel-new')
    stores.drawer.close()
    document.title = 'new channel | ' + documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {page: path, title: document.title})
    }
  }
})

Routes.setRoute('/ch/:channelId', {
  action (stores, {path, params, query}) {
    const channelId = params.channelId
    stores.channels.findOne({_id: channelId}, {})
    .then((model) => {
      if (!model) { return notFound(stores) }
      stores.posts.model.set(channelId)
      stores.posts.model.get(channelId).find({channelId}, {})
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
        window.ga('send', 'pageview', {page: path, title: document.title})
      }
    })
    .catch(err => {
      notFound(stores, err)
      this.props.snackbar.error(err.reason)
    })
  }
})

Routes.setRoute('/ch/:channelId/edit', {
  action (stores, {path, params}) {
    const channelId = params.channelId
    stores.channels.findOne({_id: channelId}, {})
    .then(data => {
      if (!data) { return notFound(stores) }
      stores.routes.setRoute('channel-edit')
      document.title = '編集中 - ' + data.name + ' | ' + documentTitle
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {page: path, title: document.title})
      }
    })
    .catch(err => {
      notFound(stores, err)
      this.props.snackbar.error(err.reason)
    })
  }
})

Routes.setRoute('/admin', {
  action (stores, {path}) {
    stores.routes.setRoute('admin')
    stores.drawer.close()
    document.title = 'マイページ | ' + documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {page: path, title: document.title})
    }
  }
})

Routes.setRoute('/config', {
  action (stores, {path}) {
    stores.routes.setRoute('config')
    stores.drawer.close()
    document.title = '各種設定 | ' + documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {page: path, title: document.title})
    }
  }
})

Routes.setRoute('/release', {
  action (stores, {path}) {
    stores.routes.setRoute('release')
    stores.drawer.close()
    document.title = 'リリースノート | ' + documentTitle
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {page: path, title: document.title})
    }
  }
})

Routes.setRoute('/report', {
  action (stores, {path}) {
    stores.reports.find()
    .then(model => {
      stores.reports.setOne(model)
      stores.routes.setRoute('report')
      stores.drawer.close()
      document.title = '統計データ | ' + documentTitle
      if (Meteor.isProduction) {
        window.ga('send', 'pageview', {page: path, title: document.title})
      }
    })
  }
})

Routes.setRoute('/twitter', {
  action (stores, {path, params}) {
    stores.routes.setRoute('twitter')
    stores.drawer.close()
    document.title = 'twitter' + ' | ' + documentTitleShort
    if (Meteor.isProduction) {
      window.ga('send', 'pageview', {page: path, title: document.title})
    }
  }
})

Routes.setRoute('/:username', {
  action (stores, {path, params}) {
    const username = params.username
    stores.users.findOneFromUsername(username)
    .then(user => {
      if (!user) return notFound(stores)
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
    window.ga('send', 'pageview', {page: '/404', title: document.title})
  }
}

export default Routes
