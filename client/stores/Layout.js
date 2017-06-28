import { observable } from 'mobx'

export default class {
  @observable scrollOver = false

  @observable width = window.innerWidth

  @observable left = false

  get oneColumn () { return this.width < 700 }

  constructor () {
    let queue = null
    window.addEventListener('resize', () => {
      clearTimeout(queue)
      queue = setTimeout(() => {
        this.width = window.innerWidth
      }, 100)
    }, false)
  }

  toMain () {
    this.left = false
  }

  toLeft () {
    this.left = true
  }

  setScrollOver (value) {
    if (value < 600) {
      if (this.scrollOver) {
        this.scrollOver = false
      }
    } else {
      if (!this.scrollOver) {
        this.scrollOver = true
      }
    }
  }
}
