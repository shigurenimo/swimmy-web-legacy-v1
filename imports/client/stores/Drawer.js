import { types } from 'mobx-state-tree'

export const model = {isOpen: false}

export const actions = self => {
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
}

export default types.model('Drawer', model).actions(actions)
