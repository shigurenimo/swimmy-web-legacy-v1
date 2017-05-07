import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import IconLanguage from 'material-ui/svg-icons/action/language'
import IconChat from 'material-ui/svg-icons/communication/chat'
import IconStyle from 'material-ui/svg-icons/image/style'
import IconEmail from 'material-ui/svg-icons/communication/email'
import { utils } from '../../imports/utils'

@inject('networks', 'posts', 'snackbar', 'user')
@observer
class NetworkInfo extends Component {
  render () {
    return <div className='container:network-info'>
      <div className='block:layout'>
        {/* ヘッダー画像 */}
        {this.data.header &&
        <div className='block:network-header'>
          {this.data.header &&
          <div className='image:network-header'
            style={{
              backgroundImage: this.data.header
                ? 'url(' + Meteor.settings.public.assets.network.root + this.data._id + '/' + this.data.header + ')'
                : 'url()'
            }}>
          </div>}
        </div>}
        {/* リスト名 */}
        <div className='block:network-name'>
          {this.data.univ &&
          <div className='text:univ'>
            {utils.regions[this.data.channel].name.jp}・{this.data.univ}
          </div>}
          {this.data.title &&
          <h2 className='text:network-title'>
            {this.data.title}
          </h2>}
          <h2 className='text:network-name'>
            {this.data.name}
          </h2>
        </div>
        {/* 説明 */}
        <div className='block:network-description'>
          <div className='text:network-description'>
            {this.data.description || '説明がありません'}
          </div>
        </div>
        {/* ハッシュタグ */}
        {this.data.tags.slice()[0] &&
        <div className='block:network-tags'>
          <div className='image:icon'>
            <IconStyle color={Meteor.settings.public.color.primary} style={{width: 30, height: 30}}/>
          </div>
          {this.data.tags.map(item =>
            <div className='text:tag' key={item}>{item}</div>)}
        </div>}
        {/* 場所 */}
        {this.data.place &&
        <div className='block:network-place'>
          <div className='text:place'>
            活動場所 : {this.data.place}
          </div>
        </div>}
        {this.data.email &&
        <div className='block:network-email'>
          <div className='image:icon'>
            <IconEmail color={Meteor.settings.public.color.primary} style={{width: 30, height: 30}}/>
          </div>
          <a className='text:text'
            target='_blank'
            href={`mailto:${this.data.email}?subject=from swimmy&body=お問い合わせ内容`}>
            {this.data.email}</a>
        </div>}
        {/* webサイト */}
        {this.data.sns.site &&
        <div className='block:network-social'>
          <div className='image:icon'>
            <IconLanguage color={Meteor.settings.public.color.primary} style={{width: 30, height: 30}}/>
          </div>
          <a className='text:social'
            target='_blank'
            href={this.data.sns.site}>
            {this.data.sns.site}</a>
        </div>}
        {/* Twitter */}
        {this.data.sns.twitter &&
        <div className='block:network-social'>
          <div className='image:icon'>
            <IconChat color={Meteor.settings.public.color.primary} style={{width: 30, height: 30}}/>
          </div>
          <a className='text:social'
            target='_blank'
            href={'//twitter.com/' + this.data.sns.twitter}>
            @{this.data.sns.twitter}</a>
        </div>}
        {this.props.user.isLogged &&
        <div className='block:edit'>
          {this.data.member.includes(this.props.user._id)
            ? <input
              className='input:edit'
              type='button'
              onTouchTap={this.onLeaveNetwork.bind(this)}
              value='チェックアウト'/>
            : <input
              className='input:edit'
              type='button'
              onTouchTap={this.onJoinNetwork.bind(this)}
              value='チェックイン'/>}
          {this.data.member.includes(this.props.user._id) &&
          <a className='input:edit' href={'/network/' + this.data._id + '/edit'}>アップデート</a>}
        </div>}
      </div>
    </div>
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

  componentDidMount () {
    this.context.onScrollTop()
  }

  static get contextTypes () {
    return {
      onScrollTop: React.PropTypes.any
    }
  }
}

export { NetworkInfo }
