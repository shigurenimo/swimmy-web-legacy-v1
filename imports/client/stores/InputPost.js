import { types } from 'mobx-state-tree'

export const model = {
  postContent: types.optional(types.string, ''),
  postImage: types.optional(types.boolean, false),
  postContentHeight: types.optional(types.number, 40)
}

export const views = self => {
  return {
    get paddingTop () {
      const image = self.postImage ? 210 : 0
      return 97 + image + self.postContentHeight
    }
  }
}

export const actions = self => {
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
}

export default types.model('InputPost', model).views(views).actions(actions)
