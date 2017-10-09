import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import Button from '/imports/ui/components/Button'
import Layout from '/imports/ui/components/UI-Layout'
import Sheet from '/imports/ui/components/UI-Sheet'
import SheetActions from '/imports/ui/components/UI-SheetActions'

export default class ConfigTwitterLogin extends Component {
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

  onLinkWithTwitter () { Meteor.linkWithTwitter() }

  onLinkWithTwitter = ::this.onLinkWithTwitter
}
