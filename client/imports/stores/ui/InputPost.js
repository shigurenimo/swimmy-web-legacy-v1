import { types } from 'mobx-state-tree'

export default types.model('InputPost', {
  postContent: types.optional(types.string, ''),
  postImage: types.optional(types.boolean, false),
  postContentHeight: types.optional(types.number, 40),
  get paddingTop () {
    const image = this.postImage ? 200 : 0
    return 101 + image + this.postContentHeight
  }
}, {
  setPostContent (value) {
    this.postContent = value
  },
  setPostImage (bool) {
    this.postImage = bool
  },
  setPostContentHeight (padding) {
    this.postContentHeight = padding
  },
  reset () {
    this.postContentHeight = 50
    this.postContent = ''
    this.postImage = false
  }
})
