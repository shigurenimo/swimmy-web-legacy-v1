import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetActions from '../../components/UI-SheetActions'
import SheetContent from '../../components/UI-SheetContent'
import utils from '/lib/imports/utils'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('channels', 'snackbar', 'accounts')
@observer
export default class ChannelInfo extends Component {
  render () {
    const {channels: {one: channel}, classes} = this.props
    return (
      <Layout>
        <Sheet>
          {channel.univ &&
          <SheetContent>
            <Typography>
              {utils.regions[channel.channel].name.jp}・{channel.univ}
            </Typography>
          </SheetContent>}
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
            channel.member.includes(this.props.accounts.one._id)
              ? <Button onTouchTap={this.onLeaveChannel}>checkout</Button>
              : <Button onTouchTap={this.onJoinChannel}>checkin</Button>}
            {channel.member.includes(this.props.accounts.one._id) &&
            <Button component='a' href={'/ch/' + channel._id + '/edit'}>update</Button>}
          </SheetActions>}
        </Sheet>
      </Layout>
    )
  }

  // チャンネルを追加する
  onJoinChannel () {
    const {_id: channelId} = this.props.channels.one
    this.props.channels.updateMember(channelId)
    .then(data => {
      this.props.snackbar.show('チャンネルを追加しました')
    })
  }

  onJoinChannel = ::this.onJoinChannel

  // チャンネルを外す
  onLeaveChannel () {
    const {_id: channelId} = this.props.channels.one
    this.props.channels.updateMember(channelId)
    .then(data => {
      this.props.snackbar.show('チャンネルを外しました')
    })
  }

  onLeaveChannel = ::this.onLeaveChannel

  componentDidMount () {
    this.context.onScrollTop()
  }

  static get contextTypes () {
    return {
      onScrollTop: propTypes.any
    }
  }
}
