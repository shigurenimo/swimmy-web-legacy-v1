import { types } from 'mobx-state-tree'

export default types
.model('Bucket', {
  _id: types.identifier(types.string),
  ownerId: types.maybe(types.string),
  owner: types.maybe(types.model('Owner', {
    username: types.maybe(types.string)
  })),
  extension: types.model('Extension', {
    name: types.string,
    note: types.string
  }),
  content: types.optional(types.array(
    types.array(types.string)
  ), []),
  createdAt: types.maybe(types.Date),
  updatedAt: types.maybe(types.Date)
}, {})
