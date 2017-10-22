import withStyles from 'material-ui/styles/withStyles'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import { inject, observer } from 'mobx-react'
import compose from 'ramda/src/compose'
import React, { Component } from 'react'

import Layout from '/imports/client/ui/components/Layout'
import Sheet from '/imports/client/ui/components/Sheet'
import SheetActions from '/imports/client/ui/components/SheetActions'
import SheetContent from '/imports/client/ui/components/SheetContent'

import styles from './index.style'

class ChannelInfo extends Component {
  render () {
    const {channels: {one: channel}, classes} = this.props
    return (
      <Layout>
        <Sheet>
          <SheetContent>
            <Typography type='headline'>
              {channel.name}
            </Typography>
          </SheetContent>
          <SheetContent>
            <Typography className={classes.content}>
              {channel.description || '説明がありません'}
            </Typography>
          </SheetContent>
          {this.props.accounts.isLogged &&
          <SheetActions align='right'>{
            channel.member.includes(this.props.accounts._id)
              ? <Button onClick={this.onLeaveChannel}>checkout</Button>
              : <Button onClick={this.onJoinChannel}>checkin</Button>}
            {channel.member.includes(this.props.accounts._id) &&
            <Button component='a' href={'/ch/' + channel._id + '/edit'}>update</Button>}
          </SheetActions>}
        </Sheet>
      </Layout>
    )
  }

  onJoinChannel = () => {
    const {_id: channelId} = this.props.channels.one
    this.props.channels.updateMember(channelId)
    .then(this.props.snackbar.setMessage)
  }

  onLeaveChannel = () => {
    const {_id: channelId} = this.props.channels.one
    this.props.channels.updateMember(channelId)
    .then(this.props.snackbar.setMessage)
  }
}

export default compose(
  withStyles(styles),
  inject(stores => ({snackbar: stores.snackbar})),
  observer
)(ChannelInfo)
