import { types } from 'mobx-state-tree'

export const model = {
  message: types.optional(types.string, ''),
  isOpen: types.optional(types.boolean, false)
}

export const actions = self => {
  return {
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
    setMessage (res) {
      console.info(res)
      const message = typeof res === 'string'
        ? res
        : res.reason
      self.message = message
      self.isOpen = true
      setTimeout(() => {
        self.unsetOpen()
      }, 2000)
    },
    setError (err) {
      const message = typeof err === 'string'
        ? err
        : err.reason
      self.message = message || 'エラーが発生しました'
      self.isOpen = true
      setTimeout(() => {
        self.unsetOpen()
      }, 2000)
    },
    requireLogin () {
      self.show('ログインが必要です')
    }
  }
}

export default types.model('Snackbar', model).actions(actions)
