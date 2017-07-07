import { types } from 'mobx-state-tree'
import Thread from '/lib/imports/models/Thread'
import { IndexModel, Model } from './Subscription'

const ThreadIndex = types.compose('ThreadIndex', IndexModel, {
  one: types.maybe(Thread),
  index: types.optional(types.array(Thread), [])
})

export default types.compose('Thread', Model, {
  map: types.maybe(types.map(ThreadIndex)),
  one: types.maybe(Thread),
  index: types.optional(types.array(Thread), [])
})
