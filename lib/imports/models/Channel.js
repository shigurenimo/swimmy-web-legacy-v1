import { types } from 'mobx-state-tree'

export default types.model({
  _id: types.string,
  ownerId: types.string,
  name: types.string,
  description: types.string,
  member: types.array(types.string),
  region: types.string,
  createdAt: types.Date,
  updatedAt: types.Date
})
