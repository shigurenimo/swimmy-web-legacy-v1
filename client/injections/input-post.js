import { action, observable } from 'mobx'

// 入力データ
class InputPost {
  @observable
  postContent = ''

  @observable
  postImage = false

  @observable
  postContentHeight = 40

  get paddingTop () {
    const image = this.postImage ? 200 : 0
    return 90 + image + this.postContentHeight
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

export { InputPost }
