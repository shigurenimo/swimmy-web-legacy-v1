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
import utils from '/lib/utils'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('networks', 'posts', 'snackbar', 'accounts') @observer
export default class NetworkInfo extends Component {
  render () {
    const {
      networks: {one: network},
      classes
    } = this.props
    return (
      <Layout>
        {network.header &&
        <Sheet>
          <SheetBackgroundImage src={
            network.header &&
            Meteor.settings.public.assets.network.root + network._id + '/' +
            network.header
          } />
        </Sheet>}
        <Sheet>
          {network.univ &&
          <SheetContent>
            <Typography>
              {utils.regions[network.channel].name.jp}・{network.univ}
            </Typography>
          </SheetContent>}
          <SheetContent>
            <Typography type='headline'>
              {network.name}
            </Typography>
          </SheetContent>
          <SheetContent>
            <Typography className={classes.content}>
              {network.description || '説明がありません'}
            </Typography>
          </SheetContent>
          {this.props.accounts.isLogged &&
          <SheetActions align='right'>
            {network.member.includes(this.props.accounts.one._id) ? (
              <Button onTouchTap={this.onLeaveNetwork}>
                チェックアウト
              </Button>
            ) : (
              <Button onTouchTap={this.onJoinNetwork}>
                チェックイン
              </Button>
            )}
          </SheetActions>}
        </Sheet>
        {this.props.accounts.isLogged &&
        this.props.accounts.one._id === network.owner &&
        <Sheet>
          <SheetActions>
            <Button onClick={this.onRemoveList}>
              このリストを削除する
            </Button>
            {network.member.includes(this.props.accounts.one._id) &&
            <Button component='a' href={'/network/' + network._id + '/edit'}>アップデート</Button>}
          </SheetActions>
        </Sheet>}
      </Layout>
    )
  }

  // リストを追加する
  onJoinNetwork () {
    const networkId = this.props.networks.one._id
    this.props.networks.updateMember(networkId)
    .then(data => {
      this.props.networks.replaceOne(data)
      this.props.networks.replaceIndex(data._id, data)
      this.props.posts.resetTimelines()
      this.props.snackbar.show('リストを追加しました')
    })
  }

  onJoinNetwork = ::this.onJoinNetwork

  // リストを外す
  onLeaveNetwork () {
    const networkId = this.props.networks.one._id
    this.props.networks.updateMember(networkId)
    .then(data => {
      this.props.networks.replaceOne(data)
      this.props.networks.replaceIndex(data._id, data)
      this.props.posts.resetTimelines()
      this.props.snackbar.show('リストを外しました')
    })
  }

  onLeaveNetwork = ::this.onLeaveNetwork

  onRemoveList () {
    const confirm = window.confirm('削除してもいいですか？')
    if (!confirm) return
    const networkId = this.props.networks.one._id
    this.props.networks.remove(networkId)
    .then(data => {
      this.props.networks.pullIndex(networkId)
      this.props.router.go('/network')
      this.props.posts.resetTempTimelines()
      this.props.posts.resetTimelines()
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
