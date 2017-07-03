import { types } from 'mobx-state-tree'
import Reply from './Reply'

export default types.model('Post', {
  _id: types.string,
  content: types.string,
  owner: types.maybe(
    types.model({
      username: types.maybe(types.string)
    })
  ),
  reactions: types.optional(types.array(
    types.model({
      name: types.string,
      owners: types.array(types.string)
    })
  ), []),
  networkId: types.maybe(types.string),
  extension: types.model({}),
  artwork: types.maybe(types.model({})),
  imagePath: types.maybe(types.string),
  tags: types.array(types.string),
  replyId: types.maybe(types.string),
  reply: types.maybe(Reply),
  replies: types.maybe(types.array(types.union(Reply, types.string))),
  createdAt: types.maybe(types.Date),
  updatedAt: types.maybe(types.Date)
})
