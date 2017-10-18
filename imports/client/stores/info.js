import { types } from 'mobx-state-tree'

export const model = {
  isOpen: types.optional(types.boolean, false)
}

export const actions = self => {
  return {
    open () {
      self.isOpen = true
    },
    close () {
      self.isOpen = false
    }
  }
}

export default types.model('Info', model).actions(actions)
