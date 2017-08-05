import { types } from 'mobx-state-tree'

export default types.model('Explore', {
  word: '',
  storage: false
}, {
  setWord (word) {
    this.word = word
  },
  toggleStorage () {
    this.storage = !this.storage
  }
})
