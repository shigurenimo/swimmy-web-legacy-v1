import { types } from 'mobx-state-tree'

export default types.model('Info', {
  isOpen: types.optional(types.boolean, false),
  network: types.maybe(
    types.model({
      _id: types.string,
      name: types.string,
      description: types.string
    })
  )
}, {
  close () {
    this.isOpen = false
    this.network = null
  },
  setNetwork (network) {
    this.isOpen = true
    this.network = network
  }
})
