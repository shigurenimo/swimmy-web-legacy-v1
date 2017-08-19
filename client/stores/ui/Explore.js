import { types } from 'mobx-state-tree'

export default types
.model('Explore', {
  word: '',
  storage: false
})
.actions(self => {
  return {
    setWord (word) {
      self.word = word
    },
    toggleStorage () {
      self.storage = !self.storage
    }
  }
})
