import { observable } from 'mobx'

export default class {
  @observable swipe = true

  removeSwipe () {
    if (this.swipe) {
      this.swipe = false
    }
  }
}
