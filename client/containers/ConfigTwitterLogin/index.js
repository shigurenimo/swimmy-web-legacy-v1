import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Button from '../../components/Button'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetActions from '../../components/UI-SheetActions'
import styleSheet from '../ConfigTwitter/index.style'

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
