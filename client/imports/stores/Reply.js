import { types } from 'mobx-state-tree'

export default types.model('Reply', {
  _id: types.string,
  content: types.string,
  owner: types.maybe(
    types.model({
      username: types.maybe(types.string)
    })
  ),
  reactions: types.array(
    types.model({
      name: types.string,
      owners: types.array(types.string)
    })
  ),
  extension: types.model({}),
  imagePath: types.maybe(types.string),
  tags: types.optional(
    types.array(types.string),
    []
  ),
  createdAt: types.maybe(types.Date),
  updatedAt: types.maybe(types.Date)
})
