import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Layout from '../components/ui-layout'
import Sheet from '../components/ui-sheet'
import SheetContent from '../components/ui-sheet-content'

@inject('router')
@observer
export default class Verify extends Component {
  onClose = ::this.onClose

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

  render () {
    return (
      <Layout>
        <Sheet>
          <SheetContent>
            <Typography>
              {this.verifyMessage}
            </Typography>
          </SheetContent>
          <SheetContent>
            <Button onClick={this.onClose}>
              アプリにもどる
            </Button>
          </SheetContent>
        </Sheet>
      </Layout>
    )
  }

  // ウィンドウを閉じる
  onClose () {
    window.open('about:blank', '_self').close()
  }
}
