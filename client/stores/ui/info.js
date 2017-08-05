import { types } from 'mobx-state-tree'

export default types.model('Info', {
  isOpen: types.optional(types.boolean, false)
}, {
  open () {
    this.isOpen = true
  },
  close () {
    this.isOpen = false
  }
})
