import { types } from 'mobx-state-tree'

export default types
.model('Channel', {
  _id: types.identifier(types.string),
  ownerId: types.string,
  name: types.string,
  description: types.string,
  member: types.array(types.string),
  region: types.string,
  createdAt: types.Date,
  updatedAt: types.Date
})
