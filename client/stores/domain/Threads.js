import { types } from 'mobx-state-tree'
import { createModel } from '/client/packages/Sub'
import Thread from '/imports/models/Thread'

export default types
.model('Thread', {
  model: createModel(Thread)
})
