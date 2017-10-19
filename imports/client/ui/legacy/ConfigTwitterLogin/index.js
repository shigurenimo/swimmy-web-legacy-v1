import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import Button from '/imports/client/ui/components/Button'
import Layout from '/imports/client/ui/components/Layout'
import Sheet from '/imports/client/ui/components/Sheet'
import SheetActions from '/imports/client/ui/components/SheetActions'

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

  onLinkWithTwitter = () => { Meteor.linkWithTwitter() }
}
