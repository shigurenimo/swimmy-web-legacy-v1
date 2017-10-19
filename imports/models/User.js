import { types } from 'mobx-state-tree'

export const ServiceTwitter = types
.model('Twitter', {
  id: types.string,
  screenName: types.string,
  profile_image_url: types.string,
  profile_image_url_https: types.string
})

export const ConfigTwitter = types
.model('Twitter', {
  useIcon: types.optional(types.boolean, false),
  publicAccount: types.optional(types.boolean, false)
})

export const model = {
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
    twitter: ConfigTwitter
  })),
  createdAt: types.maybe(types.Date),
  services: types.maybe(types.model({
    twitter: types.maybe(ServiceTwitter)
  }))
}

export default types.model('User', model)
