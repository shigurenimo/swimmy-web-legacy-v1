import { types } from 'mobx-state-tree'

export default types
.model('User', {
  _id: types.maybe(types.string),
  username: types.maybe(types.string),
  profile: types.maybe(types.model('Profile', {
    name: types.string,
    description: types.string,
    follows: types.maybe(types.array(
      types.model('Follows', {
        _id: types.string,
        username: types.string,
        name: types.string
      })
    )),
    code: types.array(types.string),
    channels: types.array(
      types.model('Channel', {
        _id: types.string,
        name: types.string
      })
    )
  })),
  emails: types.maybe(types.array(
    types.model('Email', {
      address: types.string,
      verified: types.boolean
    })
  )),
  config: types.maybe(types.model('Config', {
    twitter: types.model('Twitter', {
      useIcon: types.optional(types.boolean, false),
      publicAccount: types.optional(types.boolean, false)
    })
  })),
  createdAt: types.maybe(types.Date),
  services: types.maybe(types.model({
    twitter: types.maybe(types.model('Twitter', {
      id: types.string,
      screenName: types.string,
      profile_image_url: types.string,
      profile_image_url_https: types.string
    }))
  }))
})
