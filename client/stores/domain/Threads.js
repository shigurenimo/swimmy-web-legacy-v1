import { types } from 'mobx-state-tree'
import { createModel } from '/client/packages/Sub'
import Thread from '/lib/models/Thread'

export default types.model('Thread', {
  model: createModel(Thread)
})
