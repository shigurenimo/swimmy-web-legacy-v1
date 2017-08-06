import { types } from 'mobx-state-tree'

export default types.model('Bucket', {
  _id: types.identifier(types.string),
  name: types.string,
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
  createdAt: types.maybe(types.Date),
  updatedAt: types.maybe(types.Date)
})
