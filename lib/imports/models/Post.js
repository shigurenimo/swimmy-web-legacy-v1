import { types } from 'mobx-state-tree'
import Reply from './Reply'

export default types.model('Post', {
  _id: types.identifier(types.string),
  content: types.string,
  ownerId: types.maybe(types.string),
  owner: types.maybe(
    types.model('Owner', {
      username: types.maybe(types.string)
    })
  ),
  reactions: types.optional(types.array(
    types.model('Reaction', {
      name: types.string,
      owners: types.array(types.string)
    })
  ), []),
  channelId: types.maybe(types.string),
  extension: types.model('Extension', {}),
  artwork: types.maybe(types.model('Artwork', {})),
  imagePath: types.maybe(types.string),
  tags: types.array(types.string),
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
    return snapshot
  }
})
