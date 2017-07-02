import { getSnapshot, types } from 'mobx-state-tree'

export default types.model('Timeline', {
  unique: types.identifier(types.string),
  name: types.string,
  isStatic: types.optional(types.boolean, false),
  selector: types.union(snapshot => {
    const model = {}
    Object.keys(snapshot).forEach(name => {
      switch (name) {
        case 'network':
          model.network = types.string
          break
        case 'createdAt':
          model.createdAt = types.model({
            $gte: types.Date,
            $lt: types.Date
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
    if (snapshot.network) {
      selector.network = snapshot.network
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
    const snapshot = getSnapshot(this).selector
    const options = {}
    if (snapshot.limit) {
      options.limit = snapshot.limit
    }
    return options
  }
})
