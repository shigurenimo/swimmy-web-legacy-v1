import { types } from 'mobx-state-tree'

export default types
.model('Snackbar', {
  message: types.optional(types.string, ''),
  isOpen: types.optional(types.boolean, false)
}, {
  unsetOpen () {
    self.isOpen = false
  },
  show (message) {
    self.message = message
    self.isOpen = true
    setTimeout(() => {
      self.unsetOpen()
    }, 2000)
  },
  error (reason) {
    if (reason) {
      console.error(reason)
    }
    self.message = reason || 'エラーが発生しました'
    self.isOpen = true
    setTimeout(() => {
      self.unsetOpen()
    }, 2000)
  },
  requireLogin () {
    self.show('ログインが必要です')
  }
})
