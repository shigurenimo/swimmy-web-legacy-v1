import { types } from 'mobx-state-tree'

export const model = {isOpen: false}

export const actions = self => {
  return {
    toggle () {
      self.isOpen = !self.isOpen
    },
    open () {
      if (!self.isOpen) {
        self.isOpen = true
      }
    },
    close () {
      if (self.isOpen) {
        self.isOpen = false
      }
    }
  }
}

export default types.model('Drawer', model).actions(actions)
