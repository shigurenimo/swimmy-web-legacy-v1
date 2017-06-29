import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Button from '../components/ui-button'
import Layout from '../components/ui-layout'
import Sheet from '../components/ui-sheet'
import SheetActions from '../components/ui-sheet-actions'
import styleSheet from './twitter.style'

@withStyles(styleSheet)
@inject('layout', 'accounts') @observer
export default class TwitterLogin extends Component {
  render () {
    return (
      <Layout>
        <Sheet>
          <SheetActions>
            <Button onClick={this.onLinkWithTwitter}>
              twitterと関連付けする
            </Button>
          </SheetActions>
        </Sheet>
      </Layout>
    )
  }

  onLinkWithTwitter () {
    Meteor.linkWithTwitter()
  }

  onLinkWithTwitter = ::this.onLinkWithTwitter
}
