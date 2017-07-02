import { types } from 'mobx-state-tree'

export default types.model('Layout', {
  scrollOver: types.optional(types.boolean, false),
  width: types.optional(types.number, window.innerWidth),
  minimal: types.optional(types.boolean, false),
  left: types.optional(types.boolean, false),
  get oneColumn () { return this.width < 700 }
}, {
  setWidth (width) {
    this.width = width
  },
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
  },
  setMain () {
    this.left = false
  },
  setLeft () {
    this.left = true
  },
  afterCreate () {
    let queue = null
    window.addEventListener('resize', () => {
      clearTimeout(queue)
      queue = setTimeout(() => {
        this.setWidth(window.innerWidth)
      }, 100)
    }, false)
  }
})
