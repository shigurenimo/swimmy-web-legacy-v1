import { types } from 'mobx-state-tree'

export const model = {
  _id: types.maybe(types.string),
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
}

export default types.model('Bucket', model)
