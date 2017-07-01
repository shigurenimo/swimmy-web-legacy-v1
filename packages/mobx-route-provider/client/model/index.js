import { types } from 'mobx-state-tree'
import properties from './properties'
import actions from './actions'

export default types.model('routers', properties, actions)
