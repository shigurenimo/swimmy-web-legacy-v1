import { observable } from 'mobx'

// レイアウトデータ
class Navigation {
  @observable
  swipe = true

  removeSwipe () {
    if (this.swipe) {
      this.swipe = false
    }
  }
}

export { Navigation }
