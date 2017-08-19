import { types } from 'mobx-state-tree'

export default types.model('InputPost', {
  postContent: types.optional(types.string, ''),
  postImage: types.optional(types.boolean, false),
  postContentHeight: types.optional(types.number, 40)
})
.views(self => {
  return {
    get paddingTop () {
      const image = self.postImage ? 210 : 0
      return 97 + image + self.postContentHeight
    }
  }
})
.actions(self => {
  return {
    setPostContent (value) {
      self.postContent = value
    },
    setPostImage (bool) {
      self.postImage = bool
    },
    setPostContentHeight (padding) {
      self.postContentHeight = padding
    },
    reset () {
      self.postContentHeight = 38
      self.postContent = ''
      self.postImage = false
    }
  }
})
