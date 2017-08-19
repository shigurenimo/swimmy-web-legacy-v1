import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Layout from '/client/components/UI-Layout'
import Sheet from '/client/components/UI-Sheet'
import SheetActions from '/client/components/UI-SheetActions'
import SheetContent from '/client/components/UI-SheetContent'
import styles from './index.style'

@withStyles(styles)
@inject('channels', 'snackbar', 'accounts')
@observer
export default class ChannelInfo extends Component {
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

  onJoinChannel () {
    const {_id: channelId} = this.props.channels.one
    this.props.channels.updateMember(channelId)
    .then(data => { this.props.snackbar.show('チャンネルを追加しました') })
  }

  onJoinChannel = ::this.onJoinChannel

  onLeaveChannel () {
    const {_id: channelId} = this.props.channels.one
    this.props.channels.updateMember(channelId)
    .then(data => { this.props.snackbar.show('チャンネルを外しました') })
  }

  onLeaveChannel = ::this.onLeaveChannel

  componentDidMount () { this.context.onScrollTop() }

  static get contextTypes () { return {onScrollTop: propTypes.any} }
}
