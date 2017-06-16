import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import { Random } from 'meteor/random'
import propTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import utils from '/utils'

@inject('networks', 'snackbar')
@observer
export default class NetworkEdit extends Component {
  render () {
    return <div className='container:network-edit'>
      {/* リストの名前 */}
      <div className='block:network-name'>
        <input
          className='text:network-name'
          type='text'
          value={this.state.name}
          onChange={this.onChangeName.bind(this)}
          onBlur={this.onSubmitName.bind(this)} />
      </div>
      {/* ヘッダー画像 */}
      <div className='block:network-header'>
        <div className='block:dropzone'>
          <Dropzone
            className='input:dropzone'
            onDrop={this.onDropHeader.bind(this)}>
            <div
              className='image:header'
              style={{
                backgroundImage: this.state.header
                  ? 'url(' + Meteor.settings.public.assets.network.root + this.data._id + '/' + this.state.header + ')'
                  : null
              }}>
              <div className='text:dropzone-name'>
                header
              </div>
            </div>
          </Dropzone>
          {/* 説明文 */}
          <div className={`text:dropzone-description ${!!this.state.errorImageHeader}`}>
            {this.state.errorImageHeader
              ? this.state.errorImageHeader
              : '画像をドロップ or タップ'}
          </div>
        </div>
      </div>
      {/* 説明 */}
      <div className='block:network-description'>
        <div className='text:input-title'>
          リストの簡単な説明
        </div>
        <textarea
          className='input:network-description'
          value={this.state.description}
          placeholder='ソーシャルゲームの情報交換をするリスト'
          maxLength='400'
          onChange={this.onInputDescription.bind(this)}
          onBlur={this.onSubmitDescription.bind(this)} />
      </div>
      {/* ハッシュタグ */}
      <div className='block:network-tags'>
        <div className='text:input-title'>ハッシュタグ</div>
        <div className='block:hashtag'>
          <div className='text:hash'>#</div>
          <input className='input:hashtag'
            type='text'
            value={this.state.tags[0]}
            placeholder='ハッシュタグ'
            maxLength='20'
            onChange={this.onInputTag.bind(this, 0)}
            onBlur={this.onSubmitTag.bind(this)} />
        </div>
        <div className='block:hashtag'>
          <div className='text:hash'>#</div>
          <input className='input:hashtag'
            type='text'
            value={this.state.tags[1] || ''}
            disabled={!this.state.tags[0]}
            placeholder='タップして編集'
            maxLength='20'
            onChange={this.onInputTag.bind(this, 1)}
            onBlur={this.onSubmitTag.bind(this)} />
        </div>
        <div className='block:hashtag'>
          <div className='text:hash'>#</div>
          <input className='input:hashtag'
            type='text'
            value={this.state.tags[2] || ''}
            disabled={!this.state.tags[1]}
            placeholder='タップして編集'
            maxLength='20'
            onChange={this.onInputTag.bind(this, 2)}
            onBlur={this.onSubmitTag.bind(this)} />
        </div>
      </div>
      {/* メールアドレス */}
      <div className='block:network-email'>
        <div className='text:input-title'>電子メールアドレス</div>
        <input
          className='input:text'
          type='text'
          value={this.state.email || ''}
          placeholder='swimmy@gmail.com'
          maxLength='40'
          onChange={this.onInputEmail.bind(this)}
          onBlur={this.onSubmitEmail.bind(this)} />
      </div>
      {/* SNS:Webサイト */}
      <div className='block:network-site'>
        <div className='text:input-title'>webサイト</div>
        <input
          className='input:text'
          type='text'
          value={this.state.site || ''}
          placeholder='https://swimmy.io'
          maxLength='20'
          onChange={this.onInputSocial.bind(this, 'site')}
          onBlur={this.onSubmitSocial.bind(this, 'site')} />
      </div>
      {/* SNS:Twitter */}
      <div className='block:network-twitter'>
        <div className='text:input-title'>Twitter</div>
        <div className='text:inline'>@</div>
        <input
          className='input:text'
          type='text'
          value={this.state.twitter || ''}
          placeholder='swimmy_io'
          maxLength='20'
          onChange={this.onInputSocial.bind(this, 'twitter')}
          onBlur={this.onSubmitSocial.bind(this, 'twitter')} />
      </div>
      {/* 活動場所 */}
      <div className='block:network-place'>
        <div className='text:input-title'>活動場所</div>
        <input
          className='input:text'
          type='text'
          value={this.state.place || ''}
          placeholder={'サークル棟'}
          maxLength='20'
          onChange={this.onInputPlace.bind(this)}
          onBlur={this.onSubmitPlace.bind(this)} />
      </div>
      {/* 地域 */}
      <div className='block:network-region'>
        <div className='text:input-title'>地域</div>
        <select
          className='input:text'
          value={this.state.channel}
          onChange={this.onInputChannel.bind(this)}>
          {utils.regions.list.map(item =>
            <option key={item.value} value={item.value}>
              {item.name.jp}
            </option>)}
        </select>
      </div>
      {/* 大学 */}
      <div className='block:network-place'>
        <div className='text:input-title'>大学名</div>
        <input
          className='input:text'
          type='text'
          value={this.state.univ}
          placeholder={'名桜大学'}
          maxLength='40'
          onChange={this.onInputUniv.bind(this)}
          onBlur={this.onSubmitUniv.bind(this)} />
      </div>
    </div>
  }

  get data () {
    return this.props.networks.one
  }

  state = {
    name: this.data.name,
    header: this.data.header,
    number: this.data.number,
    description: this.data.description || '',
    channel: this.data.channel,
    place: this.data.place || '',
    site: this.data.sns.site || '',
    twitter: this.data.sns.twitter || '',
    email: this.data.email || '',
    univ: this.data.univ || '',
    tags: [
      this.data.tags.slice()[0] || '',
      this.data.tags.slice()[1] || '',
      this.data.tags.slice()[2] || ''
    ],
    errorImageHeader: null
  }

  // リストの名前を更新する
  onChangeName (event) {
    event.persist()
    const value = event.target.value
    if (value > 20) return
    if (value < 0) return
    this.setState({name: value})
  }

  // リストの名前の更新をサーバーに送信する
  onSubmitName () {
    if (this.data.name === this.state.name) return
    const networkId = this.data._id
    const next = this.state.name
    this.props.networks.updateBasic(networkId, 'name', next)
    .then(data => {
      this.props.networks.updateOne(data)
      this.props.snackbar.show('更新しました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  // 画像をアップロードしてサーバーに送信する
  onDropHeader (acceptedFiles) {
    const file = acceptedFiles[0]
    const type = file.type
    const nameArray = file.name.split('.')
    const extension = nameArray[nameArray.length - 1].toLowerCase()
    if (type.indexOf('image') === -1) {
      this.setState({errorImageHeader: 'アップロードできるのはイメージデータのみです'})
      setTimeout(() => {
        this.setState({errorImageHeader: null})
      }, 4000)
      return
    }
    if (file.size > 5000000) {
      this.setState({errorImageHeader: 'サイズが5MBを超えています'})
      setTimeout(() => {
        this.setState({errorImageHeader: null})
      }, 4000)
      return
    }
    const imageName = 'header.' + extension
    const imageNameCache = imageName + '?uuid=' + Random.id()
    const formdata = new FormData()
    formdata.append('file', file)
    formdata.append('name_min', imageName)
    formdata.append('id', this.data._id)
    if (Meteor.isDevelopment) {
      if (!Meteor.settings.public.api || !Meteor.settings.public.api.unique) {
        this.props.snackbar.errorMessage('開発環境では画像のアップロードは利用できません')
        this.process = false
        return
      }
      formdata.append('unique', Meteor.settings.public.api.unique)
    }
    this.setState({errorImageHeader: null})
    new Promise((resolve, reject) => {
      HTTP.post(Meteor.settings.public.api.network.header, {content: formdata}, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
    .then(() => {
      const networkId = this.data._id
      const next = imageNameCache
      return this.props.networks.updateBasic(networkId, 'header', next)
    })
    .then(data => {
      this.props.networks.updateOne(data)
      this.props.snackbar.show('更新しました')
      this.setState({header: imageNameCache})
    })
    .catch(err => {
      this.props.snackbar.error(err)
      this.process = false
    })
  }

  // リストの説明を更新する
  onInputDescription (event) {
    event.persist()
    const value = event.target.value
    if (value > 100) return
    if (value < 0) return
    this.setState({description: value})
  }

  // リストの説明の更新をサーバーに送信する
  onSubmitDescription () {
    const networkId = this.data._id
    const next = this.state.description
    if (this.data.description === this.state.description) return
    this.props.networks.updateBasic(networkId, 'description', next)
    .then(data => {
      this.props.networks.updateOne(data)
      this.props.snackbar.show('更新しました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  // 大学名を更新する
  onInputUniv (event) {
    event.persist()
    const value = event.target.value
    if (value > 100) return
    if (value < 0) return
    this.setState({univ: value})
  }

  // 大学名の更新をサーバーに送信する
  onSubmitUniv () {
    const networkId = this.data._id
    const next = this.state.univ
    if (this.data.univ === this.state.univ) return
    this.props.networks.updateBasic(networkId, 'univ', next)
    .then(data => {
      this.props.networks.updateOne(data)
      this.props.snackbar.show('更新しました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  // チャンネルの更新を入力する
  onInputChannel (event) {
    event.persist()
    const value = event.target.value
    this.setState({channel: value})
    const networkId = this.data._id
    const next = value
    if (this.data.channel === next) return
    this.props.networks.updateBasic(networkId, 'channel', next)
    .then(data => {
      this.props.networks.updateOne(data)
      this.props.snackbar.show('更新しました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  // 活動場所を入力する
  onInputPlace (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    this.setState({place: value})
  }

  // 活動場所の更新をサーバーに送信する
  onSubmitPlace () {
    const networkId = this.data._id
    const next = this.state.place
    if (this.data.place === this.state.place) return
    this.props.networks.updateBasic(networkId, 'place', next)
    .then(data => {
      this.props.networks.updateOne(data)
      this.props.snackbar.show('更新しました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  // テキストを入力する
  onInputSocial (name, event) {
    event.persist()
    const value = event.target.value
    const object = {}
    object[name] = value
    this.setState(object)
  }

  // テキストの更新をサーバーに送信する
  onSubmitSocial () {
    const networkId = this.data._id
    const next = {
      site: this.state.site,
      twitter: this.state.twitter,
      facebook: this.state.facebook
    }
    if (this.data.sns.site === this.state.site &&
      this.data.sns.twitter === this.state.twitter &&
      this.data.sns.facebook === this.state.facebook) return
    this.props.networks.updateBasic(networkId, 'sns', next)
    .then(data => {
      this.props.networks.updateOne(data)
      this.props.snackbar.show('更新しました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  // メールアドレスを入力する
  onInputEmail (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 40) return
    this.setState({email: value})
  }

  // メールアドレスの更新をサーバーに送信する
  onSubmitEmail () {
    const next = this.state.email
    if (next.length > 40) return
    const networkId = this.data._id
    if (this.data.email === this.state.email) return
    this.props.networks.updateBasic(networkId, 'email', next)
    .then(data => {
      this.props.networks.updateOne(data)
      this.props.snackbar.show('更新しました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  // タグを入力する
  onInputTag (index, event) {
    event.persist()
    const value = event.target.value
    if (value.length > 20) return
    const tags = this.state.tags
    tags[index] = value
    this.setState({tags: tags})
  }

  // タグの更新をサーバーに送信する
  onSubmitTag () {
    const cacheForCheck = []
    const next = this.state.tags
    .map(item => item.replace(/\s+/g, ''))
    .filter(item => item)
    .filter(item => {
      const check = !cacheForCheck.includes(item)
      cacheForCheck.push(item)
      return check
    })
    this.setState({tags: next})
    const networkId = this.data._id
    if (String(this.data.tags.slice()) === String(this.state.tags)) return
    this.props.networks.updateBasic(networkId, 'tags', next)
    .then(data => {
      this.props.networks.updateOne(data)
      this.props.snackbar.show('更新しました')
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
