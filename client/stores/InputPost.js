import { action, observable } from 'mobx'

export default class {
  @observable postContent = ''

  @observable postImage = false

  @observable postContentHeight = 40

  get paddingTop () {
    const image = this.postImage ? 200 : 0
    return 101 + image + this.postContentHeight
  }

  setPostContent (value) {
    this.postContent = value
  }

  setPostImage (bool) {
    this.postImage = bool
  }

  setPostContentHeight (padding) {
    this.postContentHeight = padding
  }

  @action
  reset () {
    this.postContentHeight = 50
    this.postContent = ''
    this.postImage = false
  }
}
