import { Meteor } from 'meteor/meteor'
import { action, observable, toJS } from 'mobx'
import { collections } from '../../imports/collections'

// 書き込みデータ（socket.io）
export default class PostsSocket {
  @observable
  index = []

  ids = {}

  @observable
  isFetching = false

  subscription = null

  cursor = null // カーソル

  uniqueCache = '' // 前回のタイムライン

  isModified (timeline) {
    if (this.uniqueCache && this.uniqueCache === timeline.unique) {
      return false
    }
    this.uniqueCache = timeline.unique
    return true
  }

  @action
  updateIndex (stocks) {
    stocks.forEach(stock => {
      const id = stock._id
      if (this.ids[id]) return
      this.ids[stock._id] = stock
      this.index.push(stock)
    })
    this.index = this.index.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  // データを取得する
  @action
  subscribe (timeline) {
    const self = this
    if (!this.isModified(timeline)) return
    this.isFetching = true
    if (this.cursor) {
      this.cursor.stop()
      this.cursor = null
      this.ids = {}
      this.index = []
    }
    if (this.subscription) {
      this.subscription.stop()
    }
    const {selector, options} = toJS(timeline)
    setTimeout(() => {
      this.isFetching = false
    }, 5000)
    this.subscription = Meteor.subscribe('posts', selector, options, {
      onReady () {
        let time = false
        let stocks = []
        self.cursor = collections.posts.find().observe({
          addedAt (res) {
            stocks.push(res)
            if (time !== false) clearTimeout(time)
            time = setTimeout(() => {
              self.updateIndex(stocks)
              self.isFetching = false
            }, 10)
          },
          changed (res) {
            const id = res._id
            self.ids[id] = res
            for (let i = 0, len = self.index.length; i < len; ++i) {
              if (self.index[i]._id !== id) continue
              self.index[i] = res
              break
            }
          },
          removed (res) {
            const id = res._id
            self.ids[id] = null
            for (let i = 0, len = self.index.length; i < len; ++i) {
              if (self.index[i]._id !== id) continue
              self.index.splice(i, 1)
              break
            }
          }
        })
      }
    })
  }
}
