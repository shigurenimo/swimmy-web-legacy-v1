import { getSnapshot, types } from 'mobx-state-tree'

export default types.model('Timeline', {
  name: types.string,
  networkId: types.maybe(types.string),
  other: types.maybe(
    types.union(
      types.model({
        y: types.number,
        m: types.number,
        d: types.number
      })
    )
  )
}, {
  getSelector () {
    const snapshot = getSnapshot(this).selector
    const selector = {}
    if (snapshot.networkId) {
      selector.networkId = snapshot.networkId
    }
    if (snapshot['owner.username']) {
      selector['owner.username'] = snapshot['owner.username']
    }
    if (snapshot.createdAt) {
      selector.createdAt = {}
      if (snapshot.createdAt.$gte) {
        selector.createdAt.$gte = new Date(snapshot.createdAt.$gte)
      }
      if (snapshot.createdAt.$lt) {
        selector.createdAt.$lt = new Date(snapshot.createdAt.$lt)
      }
    }
    return selector
  },
  getOptions () {
    const snapshot = getSnapshot(this).options
    const options = {}
    if (snapshot.limit) {
      options.limit = snapshot.limit
    }
    return options
  }
})
