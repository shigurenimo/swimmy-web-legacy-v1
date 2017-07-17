import { types } from 'mobx-state-tree'

export default types.model('Drawer', {
  isOpen: false
}, {
  toggle () {
    this.isOpen = !this.isOpen
  },
  open () {
    this.isOpen = true
  },
  close () {
    this.isOpen = false
  }
})
