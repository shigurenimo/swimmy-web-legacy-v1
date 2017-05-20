import { action, observable } from 'mobx'

// クライアントサイドルーティングデータ
export default class Router {
  @observable
  page = null // 表示しているページ

  @observable
  pageCache = null // 前回表示したページ

  @observable
  scrollCache = 0 // 前回表示したページのスクロール値

  @observable
  verifyError = null

  @action
  setRoute (page) {
    switch (this.page) {
      case 'timeline':
      case 'thread-list':
      case 'network-list':
      case 'artwork': {
        const element = document.querySelector('.container\\:content')
        if (element) {
          this.scrollCache = element.scrollTop
        }
        break
      }
    }
    this.pageCache = this.page
    this.page = page
  }
}
