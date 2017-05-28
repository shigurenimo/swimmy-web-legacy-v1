import { FlowRouter } from 'meteor/kadira:flow-router'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { isNumeric } from 'validator'
import utils from '../../imports/utils'

@inject('networks', 'posts', 'snackbar')
@observer
export default class NetworkNew extends Component {
  render () {
    return <div className='container:network-new'>
      {/* リストの名前 */}
      <div className='block:network-name'>
        <div className='text:input-title'>
          リストの名前
          <div className='text:require'>必須</div>
        </div>
        <input
          className='input:text'
          type='text'
          value={this.state.networkName}
          placeholder='ソーシャルゲーム'
          maxLength='100'
          onChange={this.onInputNetworkName.bind(this)} />
      </div>
      {/* リストの説明 */}
      <div className='block:network-description'>
        <div className='text:input-title'>簡単な説明</div>
        <textarea
          className='input:text'
          value={this.state.networkDescription}
          placeholder='ソーシャルゲームの情報交換をするリスト'
          maxLength='400'
          onChange={this.onInputNetworkDescription.bind(this)} />
      </div>
      {/* もっと詳しく */}
      {!this.state.isDetail &&
      <div className='block:open-detail'>
        <input className='input:open-detail' type='button' value='もっと詳しく設定する'
          onTouchTap={this.onOpenDetail.bind(this)} />
      </div>}

      {this.state.isDetail &&
      <div>
        {/* SNS:Webサイト */}
        <div className='block:network-social'>
          <div className='text:input-title'>Webサイト</div>
          <input
            className='input:text'
            type='text'
            value={this.state.networkSite}
            placeholder='https://swimmy.io'
            maxLength='20'
            onChange={this.onInputNetworkSite.bind(this)} />
        </div>
        {/* SNS:Twitter */}
        <div className='block:network-social'>
          <div className='text:input-title'>Twitter</div>
          <div className='text:inline'>@</div>
          <input
            className='input:text'
            type='text'
            value={this.state.networkTwitter}
            placeholder='swimmy_io'
            maxLength='20'
            onChange={this.onInputNetworkTwitter.bind(this)} />
        </div>
        <div className='block:post-description'>
          <div className='text:post-description'>
            もし、大学サークルなら
          </div>
        </div>
        {/* 地域 */}
        <div className='block:network-region'>
          <div className='text:input-title'>地域</div>
          <select
            className='input:text'
            value={this.state.networkChannel}
            onChange={this.onInputNetworkChannel.bind(this)}>
            {utils.regions.list.map(item =>
              <option key={item.value} value={item.value}>
                {item.name.jp}
              </option>)}
          </select>
        </div>
        {/* 大学 */}
        <div className='block:network-university'>
          <div className='text:input-title'>
            大学名
          </div>
          <input
            className='input:network-university'
            type='text'
            value={this.state.networkUniversity}
            placeholder='名桜大学'
            maxLength='40'
            onChange={this.onInputNetworkUniversity.bind(this)} />
        </div>
        {/* 活動場所 */}
        <div className='block:network-place'>
          <div className='text:input-title'>主な活動場所</div>
          <input
            className='input:text'
            type='text'
            value={this.state.networkPlace}
            placeholder='サークル棟2階'
            maxLength='20'
            onChange={this.onInputNetworkPlace.bind(this)} />
        </div>
      </div>}
      {/* エラー */}
      {this.state.submitError &&
      <div className='block:error'>
        <div className='text:error'>
          {this.state.submitError}
        </div>
      </div>}
      {/* 送信 */}
      <div className='block:submit'>
        <input
          className='input:submit'
          type='button'
          value='作成する'
          onTouchTap={this.onSubmit.bind(this)}>
        </input>
      </div>
    </div>
  }

  state = {
    isDetail: false,
    networkName: '',
    networkDescription: '',
    networkUniversity: '',
    networkTags: [],
    networkPlace: '',
    networkChannel: 'tokyo',
    networkSite: '',
    networkTwitter: '',
    networkFacebook: '',
    submitError: ''
  }

  process = false

  onOpenDetail () {
    this.setState({isDetail: true})
  }

  // リスト名を入力する
  onInputNetworkName (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    this.setState({networkName: value})
  }

  // リストの説明を入力する
  onInputNetworkDescription (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 400) return
    this.setState({networkDescription: value})
  }

  // リストの大学名を入力する
  onInputNetworkUniversity (event) {
    event.persist()
    const value = event.target.value
    this.setState({networkUniversity: value})
  }

  // リストの活動場所を入力する
  onInputNetworkPlace (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    this.setState({networkPlace: value})
  }

  // リストの地域を入力する
  onInputNetworkChannel (event) {
    event.persist()
    const value = event.target.value
    this.setState({networkChannel: value})
  }

  // リストのサイトを入力する
  onInputNetworkSite (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    this.setState({networkSite: value})
  }

  // リストのTwitterアカウントを更新する
  onInputNetworkTwitter (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    if (value.indexOf('@') !== -1) return
    this.setState({networkTwitter: value})
  }

  // リストのFacebookアカウントを入力する
  onInputNetworkFacebook (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    if (!isNumeric(value)) return
    this.setState({networkFacebook: value})
  }

  // リストを送信する
  onSubmit () {
    if (this.process) return
    this.process = true
    if (!this.state.networkName) {
      this.setState({submitError: 'サークルの名前を入力してください'})
      this.process = false
      return
    }
    this.setState({submitError: null})
    const next = {
      name: this.state.networkName,
      description: this.state.networkDescription,
      university: this.state.university,
      channel: this.state.networkChannel,
      place: this.state.networkPlace,
      tags: this.state.networkTags,
      sns: {
        site: this.state.networkSite,
        twitter: this.state.networkTwitter,
        facebook: this.state.networkFacebook
      }
    }
    this.props.networks.insert(next)
    .then(() => {
      const {selector, options} = this.props.networks.timeline
      return this.props.networks.fetch(selector, options)
    })
    .then(data => {
      this.props.networks.insertIndex(data)
      FlowRouter.go('/network')
      this.props.posts.resetTimelines()
      this.props.snackbar.show('新しいリストを作成しました')
      this.process = false
    })
    .catch(err => {
      this.props.snackbar.error(err)
      this.process = false
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
