import { types } from 'mobx-state-tree'

export default types
.model('Timeline', {
  name: types.maybe(types.string),
  channelId: types.maybe(types.string),
  unique: types.maybe(types.string)
})
.actions(self => {
  return {
    setCurrent ({channelId = null, unique = '', name = ''}) {
      if (channelId) {
        self.channelId = channelId
      }
      if (unique) {
        self.unique = unique
      }
      switch (unique) {
        case 'self':
          self.name = '自分の書き込み'
          break
        case 'follows':
          self.name = 'ユーザの書き込み'
          break
        case 'root':
          self.name = 'チャット'
          break
        default:
          if (name) {
            self.name = name
          }
      }
    }
  }
})
