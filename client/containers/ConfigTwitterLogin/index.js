import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Button from '/client/components/Button'
import Layout from '/client/components/UI-Layout'
import Sheet from '/client/components/UI-Sheet'
import SheetActions from '/client/components/UI-SheetActions'
import styleSheet from '../ConfigTwitter/index.style'

@withStyles(styleSheet)
@inject('accounts')
@observer
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
