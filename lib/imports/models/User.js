import { types } from 'mobx-state-tree'

export default types.model('User', {
  _id: types.identifier(types.string),
  username: types.string,
  profile: types.maybe(
    types.model('Profile', {
      name: types.string,
      description: types.string,
      follows: types.array(types.string),
      code: types.array(types.string),
      channels: types.array(
        types.model('Channel', {
          _id: types.string,
          name: types.string
        })
      )
    })
  ),
  emails: types.maybe(
    types.array(
      types.model('Email', {
        address: types.string,
        verified: types.boolean
      })
    )
  ),
  config: types.maybe(
    types.model({})
  ),
  createdAt: types.maybe(types.Date),
  services: types.maybe(types.model({}))
}, {})
