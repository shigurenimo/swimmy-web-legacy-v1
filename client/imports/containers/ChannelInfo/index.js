import { Meteor } from 'meteor/meteor'
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
import SheetBackgroundImage from '../../components/UI-SheetBackgroundImage'
import utils from '/lib/imports/utils'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('channels', 'snackbar', 'accounts', 'timelines') @observer
export default class ChannelInfo extends Component {
  render () {
    const {
      channels: {one: channel},
      classes
    } = this.props
    return (
      <Layout>
        {channel.header &&
        <Sheet>
          <SheetBackgroundImage src={
            channel.header &&
            Meteor.settings.public.assets.channel.root + channel._id + '/' +
            channel.header
          } />
        </Sheet>}
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
          <SheetActions align='right'>
            {channel.member.includes(this.props.accounts.one._id) ? (
              <Button onTouchTap={this.onLeaveChannel}>
                チェックアウト
              </Button>
            ) : (
              <Button onTouchTap={this.onJoinChannel}>
                チェックイン
              </Button>
            )}
          </SheetActions>}
        </Sheet>
        {this.props.accounts.isLogged &&
        this.props.accounts.one._id === channel.owner &&
        <Sheet>
          <SheetActions>
            <Button onClick={this.onRemoveList}>
              このリストを削除する
            </Button>
            {channel.member.includes(this.props.accounts.one._id) &&
            <Button component='a' href={'/channel/' + channel._id + '/edit'}>アップデート</Button>}
          </SheetActions>
        </Sheet>}
      </Layout>
    )
  }

  // リストを追加する
  onJoinChannel () {
    const channelId = this.props.channels.one._id
    this.props.channels.updateMember(channelId)
    .then(data => {
      this.props.channels.replaceOne(data)
      this.props.channels.replaceIndex(data._id, data)
      this.props.timelines.resetIndex()
      this.props.snackbar.show('リストを追加しました')
    })
  }

  onJoinChannel = ::this.onJoinChannel

  // リストを外す
  onLeaveChannel () {
    const channelId = this.props.channels.one._id
    this.props.channels.updateMember(channelId)
    .then(data => {
      this.props.channels.replaceOne(data)
      this.props.channels.replaceIndex(data._id, data)
      this.props.timelines.resetIndex()
      this.props.snackbar.show('リストを外しました')
    })
  }

  onLeaveChannel = ::this.onLeaveChannel

  onRemoveList () {
    const confirm = window.confirm('削除してもいいですか？')
    if (!confirm) return
    const channelId = this.props.channels.one._id
    this.props.channels.remove(channelId)
    .then(data => {
      this.props.channels.pullIndex(channelId)
      this.props.router.go('/channel')
      this.props.timelines.resetTemp()
      this.props.timelines.resetIndex()
      this.props.snackbar.show('リストを削除しました')
    })
    .catch(err => this.props.snackbar.error(err.reason))
  }

  onRemoveList = ::this.onRemoveList

  componentDidMount () {
    this.context.onScrollTop()
  }

  static get contextTypes () {
    return {
      onScrollTop: propTypes.any
    }
  }
}
