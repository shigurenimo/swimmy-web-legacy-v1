import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Layout from '../components/ui-layout'
import Sheet from '../components/ui-sheet'
import SheetActions from '../components/ui-sheet-actions'
import SheetContent from '../components/ui-sheet-content'
import SheetBackgroundImage from '../components/ui-sheet-background-image'
import utils from '../../imports/utils'

@inject('networks', 'posts', 'snackbar', 'user')
@observer
export default class NetworkInfo extends Component {
  render () {
    return (
      <Layout>
        {this.data.header &&
        <Sheet className='block:network-header'>
          {this.item.header &&
          <SheetBackgroundImage src={
            this.item.header &&
            Meteor.settings.public.assets.network.root + this.data._id + '/' + this.data.header
          } />}
        </Sheet>}
        <Sheet>
          {this.data.univ &&
          <SheetContent>
            <Typography>
              {utils.regions[this.data.channel].name.jp}・{this.data.univ}
            </Typography>
          </SheetContent>}
          <SheetContent>
            <Typography type='headline'>
              {this.data.name}
            </Typography>
          </SheetContent>
          <SheetContent>
            <Typography>
              {this.data.description || '説明がありません'}
            </Typography>
          </SheetContent>
          {this.props.user.isLogged &&
          <SheetActions align='right'>
            {this.data.member.includes(this.props.user._id) ? (
              <Button onTouchTap={this.onLeaveNetwork.bind(this)}>
                チェックアウト
              </Button>
            ) : (
              <Button onTouchTap={this.onJoinNetwork.bind(this)}>
                チェックイン
              </Button>
            )}
          </SheetActions>}
        </Sheet>
        {this.props.user.isLogged &&
        this.props.user._id === this.data.owner &&
        <Sheet>
          <SheetActions>
            <Button onClick={this.onRemoveList.bind(this)}>
              このリストを削除する
            </Button>
            {this.data.member.includes(this.props.user._id) &&
            <Button component='a' href={'/network/' + this.data._id + '/edit'}>アップデート</Button>}
          </SheetActions>
        </Sheet>}
      </Layout>
    )
  }

  get data () {
    return this.props.networks.one
  }

  // リストを追加する
  onJoinNetwork () {
    const networkId = this.props.networks.one._id
    this.props.networks.join(networkId)
    .then(data => {
      this.props.networks.updateOne(data)
      this.props.networks.updateIndex(data._id, data)
      this.props.posts.resetTimelines()
      this.props.snackbar.show('リストを追加しました')
    })
  }

  // リストを外す
  onLeaveNetwork () {
    const networkId = this.props.networks.one._id
    this.props.networks.join(networkId)
    .then(data => {
      this.props.networks.updateOne(data)
      this.props.networks.updateIndex(data._id, data)
      this.props.posts.resetTimelines()
      this.props.snackbar.show('リストを外しました')
    })
  }

  onRemoveList () {
    const confirm = window.confirm('削除してもいいですか？')
    if (!confirm) return
    const networkId = this.props.networks.one._id
    this.props.networks.remove(networkId)
    .then(data => {
      this.props.networks.removeIndex(networkId)
      FlowRouter.go('/network')
      this.props.posts.resetTempTimelines()
      this.props.posts.resetTimelines()
      this.props.snackbar.show('リストを削除しました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  componentDidMount () {
    this.context.onScrollTop()
  }

  static get contextTypes () {
    return {
      onScrollTop: propTypes.any
    }
  }
}
