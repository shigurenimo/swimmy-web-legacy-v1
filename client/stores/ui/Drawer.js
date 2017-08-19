import { types } from 'mobx-state-tree'

export default types
.model('Drawer', {
  isOpen: false
})
.actions(self => {
  return {
    toggle () {
      self.isOpen = !self.isOpen
    },
    open () {
      self.isOpen = true
    },
    close () {
      self.isOpen = false
    }
  }
})
