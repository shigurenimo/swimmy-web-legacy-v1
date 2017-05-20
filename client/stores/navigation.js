import { observable } from 'mobx'

// レイアウトデータ
export default class Navigation {
  @observable
  swipe = true

  removeSwipe () {
    if (this.swipe) {
      this.swipe = false
    }
  }
}
