import { types } from 'mobx-state-tree'

import Reply from './Reply'

export const model = {
  _id: types.maybe(types.string),
  content: types.string,
  owner: types.maybe(
    types.model('Owner', {
      username: types.maybe(types.string)
    })
  ),
  channelId: types.maybe(types.string),
  extension: types.model('Extension', {}),
  artwork: types.maybe(types.model('Artwork', {})),
  imagePath: types.maybe(types.string),
  tags: types.maybe(types.array(types.string)),
  repliedPostIds: types.maybe(types.array(types.union(Reply, types.string))),
  createdAt: types.maybe(types.Date),
  updatedAt: types.maybe(types.Date)
}

export default types.model('Thread', model)
