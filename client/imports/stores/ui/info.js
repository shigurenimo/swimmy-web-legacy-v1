import { types } from 'mobx-state-tree'

export default types.model('Info', {
  isOpen: types.optional(types.boolean, false),
  channel: types.maybe(
    types.model({
      _id: types.string,
      name: types.string,
      description: types.string
    })
  )
}, {
  close () {
    this.isOpen = false
    this.channel = null
  },
  setChannel (channel) {
    this.isOpen = true
    this.channel = channel
  }
})
