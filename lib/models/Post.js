import { types } from 'mobx-state-tree'
import Reply from './Reply'

export default types.model('Post', {
  _id: types.identifier(types.string),
  content: types.string,
  ownerId: types.maybe(types.string),
  owner: types.maybe(types.model('Owner', {
    username: types.maybe(types.string)
  })),
  reactions: types.optional(types.array(
    types.model('Reaction', {
      name: types.string,
      ownerIds: types.array(types.string)
    })
  ), []),
  channelId: types.maybe(types.string),
  extension: types.model('Extension', {
    web: types.maybe(types.model('Web', {
      url: types.maybe(types.string),
      html: types.maybe(types.model('Html', {
        title: types.maybe(types.string),
        description: types.maybe(types.string),
        meta: types.maybe(types.model('Meta', {
          'og:site_name': types.maybe(types.string),
          'og:url': types.maybe(types.string),
          'og:title': types.maybe(types.string),
          'og:image': types.maybe(types.string),
          'og:description': types.maybe(types.string),
          'og:type': types.maybe(types.string)
        }))
      })),
      oEmbed: types.maybe(types.model('oEmbed', {
        thumbnail_width: types.maybe(types.number),
        thumbnail_url: types.maybe(types.string),
        thumbnail_height: types.maybe(types.number),
        html: types.maybe(types.string),
        title: types.maybe(types.string)
      }))
    }))
  }),
  artwork: types.maybe(types.model('Artwork', {})),
  images: types.maybe(types.array(
    types.model({
      full: types.string,
      x256: types.string,
      x512: types.string,
      x1024: types.string
    })
  )),
  imagePath: types.maybe(types.string),
  replyId: types.maybe(types.string),
  reply: types.maybe(Reply),
  replies: types.maybe(types.array(types.union(Reply, types.string))),
  createdAt: types.maybe(types.string)
}, {
  preProcessSnapshot (snapshot) {
    if (!snapshot) return snapshot
    if (snapshot.createdAt) {
      snapshot.createdAt = snapshot.createdAt.toString()
    }
    if (snapshot.reactions && snapshot.reactions.length !== 0) {
      if (snapshot.reactions[0].owners) {
        snapshot.reactions = snapshot.reactions.map(item => {
          return {
            name: item.name,
            ownerIds: item.owners
          }
        })
      }
    }
    return snapshot
  }
})
