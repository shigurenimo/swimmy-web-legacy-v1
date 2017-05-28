import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'

@inject('router')
@observer
export default class Verify extends Component {
  render () {
    return <div className='container:verify'>
      <div className='block:layout'>
        <div className='block:verify-message'>
          <div className='text:verify-message'>
            {this.verifyMessage}
          </div>
        </div>
        <div className='block:home'>
          <input
            className='text:home'
            type='button'
            value='アプリにもどる'
            onTouchTap={this.onClose.bind(this)}/>
        </div>
      </div>
    </div>
  }

  // ウィンドウを閉じる
  onClose () {
    window.open('about:blank', '_self').close()
  }

  get verifyMessage () {
    if (this.props.router.verifyError === null) {
      return '読み込み中..'
    }
    if (this.props.router.verifyError) {
      return 'エラーが発生しました'
    } else {
      return '本人確認できました'
    }
  }
}
