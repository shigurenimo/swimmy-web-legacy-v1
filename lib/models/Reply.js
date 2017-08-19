import { types } from 'mobx-state-tree'

export default types
.model('Reply', {
  _id: types.maybe(types.string),
  content: types.string,
  owner: types.maybe(
    types.model('Owner', {
      username: types.maybe(types.string)
    })
  ),
  extension: types.maybe(types.model('Extension', {})),
  images: types.maybe(types.array(
    types.model({
      full: types.string,
      x256: types.string,
      x512: types.string,
      x1024: types.string
    })
  )),
  imagePath: types.maybe(types.string),
  tags: types.maybe(types.array(types.string)),
  createdAt: types.maybe(types.Date),
  updatedAt: types.maybe(types.Date)
})
