import { types } from 'mobx-state-tree'

export default types.model('Info', {
  isOpen: types.optional(types.boolean, false)
}, {
  open () {
    this.networkInfo = true
  },
  close () {
    this.networkInfo = false
  }
})
