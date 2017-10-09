import { types } from 'mobx-state-tree'

export default types
.model('Info', {
  isOpen: types.optional(types.boolean, false)
})
.actions(self => {
  return {
    open () {
      self.isOpen = true
    },
    close () {
      self.isOpen = false
    }
  }
})
