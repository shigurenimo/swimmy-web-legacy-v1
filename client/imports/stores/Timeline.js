import { getSnapshot, types } from 'mobx-state-tree'

export default types.model('Timeline', {
  unique: types.identifier(types.string),
  name: types.string,
  networkId: types.maybe(types.string),
  isStatic: types.optional(types.boolean, false),
  selector: types.union(snapshot => {
    const model = {}
    Object.keys(snapshot).forEach(name => {
      switch (name) {
        case 'networkId':
          model.networkId = types.string
          break
        case 'createdAt':
          model.createdAt = types.model({
            $gte: types.Date,
            $lt: types.Date
          })
          break
        case 'owner.username':
          model['owner.username'] = types.model({
            $in: types.array(types.string)
          })
      }
    })
    return types.model(model)
  }),
  options: types.union(snapshot => {
    const model = {}
    Object.keys(snapshot).forEach(name => {
      switch (name) {
        case 'limit':
          model.limit = snapshot.limit
          break
      }
    })
    return types.model(model)
  }),
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
