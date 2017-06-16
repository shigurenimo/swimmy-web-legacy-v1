import { Random } from 'meteor/random'

export default class {
  index = []

  get wait () { return this.index.length !== 0 }

  checkin () {
    const uuid = Random.id()
    this.index.push(uuid)
    return uuid
  }

  checkout (uuid) {
    for (let i = 0, len = this.index.length; i < len; ++i) {
      if (this.index[i]._id !== uuid) continue
      this.index.splice(i, 1)
      break
    }
  }
}
