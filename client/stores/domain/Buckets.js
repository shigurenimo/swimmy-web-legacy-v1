import { types } from 'mobx-state-tree'
import { IndexModel, Model } from './Subscription'
import Bucket from '/lib/models/Bucket'

const BucketIndex = types.compose('BucketIndex', IndexModel, {
  one: types.maybe(Bucket),
  index: types.optional(types.array(Bucket), [])
})

export default types.compose('Buckets', Model, {
  map: types.maybe(types.map(BucketIndex)),
  one: types.maybe(Bucket),
  index: types.optional(types.array(Bucket), [])
}, {})
