import { types } from 'mobx-state-tree'

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
  replies: types.array(types.string),
  createdAt: types.maybe(types.Date),
  updatedAt: types.maybe(types.Date)
})
