import { types } from 'mobx-state-tree'

export default types.model('User', {
  _id: types.identifier(types.string),
  username: types.string,
  profile: types.maybe(
    types.model({
      name: types.string,
      description: types.string,
      follows: types.array(types.string),
      code: types.array(types.string),
      networks: types.array(types.string)
    })
  ),
  emails: types.maybe(
    types.array(
      types.model({
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
