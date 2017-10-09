import { types } from 'mobx-state-tree'
import { createModel } from '/client/packages/Sub'
import Bucket from '/imports/models/Bucket'

export default types
.model('Buckets', {
  model: createModel(Bucket)
})
