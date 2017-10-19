import { types } from 'mobx-state-tree'

export const model = {
  _id: types.maybe(types.string),
  ownerId: types.string,
  name: types.string,
  description: types.string,
  member: types.array(types.string),
  region: types.string,
  createdAt: types.Date,
  updatedAt: types.Date
}

export default types.model('Channel', model)
