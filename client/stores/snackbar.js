import { action, observable } from 'mobx'

// スナックバーデータ
export default class Snackbar {
  @observable
  message = '' // レポートに表示するメッセージ

  @observable
  isShow = false // レポートの表示の状態

  @action
  show (message) {
    this.message = message
    this.isShow = true
    setTimeout(() => {
      this.isShow = false
    }, 2000)
  }

  @action
  error (error = {}) {
    if (error.error === 'ignore') return
    if (error) {
      console.error(error.message || error)
    }
    this.message = error.reason || 'エラーが発生しました'
    this.isShow = true
    setTimeout(() => {
      this.isShow = false
    }, 2000)
  }

  errorMessage (message) {
    this.error({reason: message, message})
  }

  requireLogin () {
    this.show('ログインが必要です')
  }
}
