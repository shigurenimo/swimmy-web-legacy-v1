import { types } from 'mobx-state-tree'
import Reply from './Reply'

export default types.model('Post', {
  _id: types.identifier(types.string),
  content: types.string,
  owner: types.model({
    username: types.maybe(types.string)
  }),
  reactions: types.array(
    types.model({
      name: types.string,
      owners: types.array(types.string)
    })
  ),
  extension: types.model({}),
  imagePath: types.maybe(types.string),
  tags: types.array(types.string),
  replyId: types.maybe(types.string),
  reply: types.maybe(Reply),
  createdAt: types.maybe(types.Date),
  updatedAt: types.maybe(types.Date)
})
