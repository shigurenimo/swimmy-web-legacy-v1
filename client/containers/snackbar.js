import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'

@inject('layout', 'snackbar', 'router')
@observer
export default class Snackbar extends Component {
  render () {
    return <div className={this.className}>
      {this.props.snackbar.message}
    </div>
  }

  get className () {
    return `container:snackbar ${this.isShow} ${this.isMinimal}`
  }

  get isShow () {
    return this.props.snackbar.isShow ? 'on' : 'off'
  }

  // ヘッダーが最小化されているかどうか
  get isMinimal () {
    switch (this.props.router.page) {
      case 'home':
        return 'minimal-not'
    }
    if (this.props.layout.scrollOver) {
      return 'minimal'
    }
  }
}
