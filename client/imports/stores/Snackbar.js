import { types } from 'mobx-state-tree'

export default types.model('Snackbar', {
  message: types.optional(types.string, ''),
  isOpen: types.optional(types.boolean, false)
}, {
  unsetOpen () {
    this.isOpen = false
  },
  show (message) {
    this.message = message
    this.isOpen = true
    setTimeout(() => {
      this.unsetOpen()
    }, 2000)
  },
  error (reason) {
    if (reason) {
      console.error(reason)
    }
    this.message = reason || 'エラーが発生しました'
    this.isOpen = true
    setTimeout(() => {
      this.unsetOpen()
    }, 2000)
  },
  requireLogin () {
    this.show('ログインが必要です')
  }
})
