import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import { Random } from 'meteor/random'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import IconClear from 'material-ui-icons/Clear'
import { utils } from '../../imports/utils'

@inject('artworks', 'snackbar', 'user')
@observer
export default class ArtworkNew extends Component {
  render () {
    return <div className='container:artwork-new'>
      <div className='block:container-layout'>
        {/* 画像の投稿 */}
        <div className='block:dropzone'>
          <Dropzone
            className='input:dropzone'
            onDrop={this.onDropImage.bind(this)}>
            <div className='block:frame'>
              {this.state.inputImage &&
              <img src={this.state.inputImage.preview} />}
              {!this.state.inputImage &&
              <div className='text:dropzone-name'>画像をドロップ or タップ</div>}
            </div>
          </Dropzone>
          {this.state.inputImage &&
          <div className='input:close-message'
            onTouchTap={this.onCloseImage.bind(this)}>
            <IconClear style={{width: 35, height: 35}} color='tomato' hoverColor='white' />
          </div>}
        </div>
        {/* エラーメッセージ */}
        {this.state.errorImage &&
        <div className='block:error-image'>
          <div className='text:error-image'>{this.state.errorImage}</div>
        </div>}
        {/* タイトル */}
        <div className='block:post-title'>
          <input
            className='input:post-title'
            placeholder='タイトル（任意）'
            type='text'
            value={this.state.inputTitle}
            maxLength='100'
            onChange={this.onInputTitle.bind(this)} />
        </div>
        {/* ノート */}
        <div className='block:post-note'>
        <textarea
          className='input:post-note'
          placeholder='タップしてノートを入力'
          onChange={this.onInputNote.bind(this)}
          rows={4}
          maxLength='1000'
          value={this.state.inputNote} />
        </div>
        {/* カラー */}
        <div className='block:post-color'>
          {utils.color.cmyk.map(code =>
            <div
              className={`block:color ${this.state.inputColors.includes(code)}`}
              key={code}
              onTouchTap={this.onSelectColor.bind(this, code)}>
              <div
                className='image:color'
                style={{backgroundColor: '#' + code}} />
            </div>)}
        </div>
        {/* レーティング */}
        {/*
        <div className='block:post-rate'>
          <div
            className={`input:rate ${this.state.inputRate === 0}`}
            onTouchTap={this.onSelectRate.bind(this, 0)}>G
          </div>
          <div
            className={`input:rate ${this.state.inputRate === 12}`}
            onTouchTap={this.onSelectRate.bind(this, 12)}>PG12
          </div>
          <div
            className={`input:rate ${this.state.inputRate === 15}`}
            onTouchTap={this.onSelectRate.bind(this, 15)}>R15+
          </div>
          <div
            className={`input:rate ${this.state.inputRate === 18}`}
            onTouchTap={this.onSelectRate.bind(this, 18)}>R18+
          </div>
        </div>
        */}
        {/* 匿名 */}
        <div className='block:post-public'>
          <div className='text:select-name'>匿名</div>
          <input className={'input:public ' + !this.state.isPublic}
            type='button'
            value='オン'
            onTouchTap={this.onChangePublic.bind(this, false)} />
          <input className={'input:public ' + this.state.isPublic}
            type='button'
            value='オフ'
            onTouchTap={this.onChangePublic.bind(this, true)} />
          {this.state.isPublic &&
          <div className='text:public-info'>
            ユーザネームが公開されます
          </div>}
        </div>
        {/* タイムラインの表示 */}
        <div className='block:post-public'>
          <div className='text:select-name'>過去の作品</div>
          <input className={'input:public ' + this.state.isSecret}
            type='button'
            value='オン'
            onTouchTap={this.onChangeSecret.bind(this, true)} />
          <input className={'input:public ' + !this.state.isSecret}
            type='button'
            value='オフ'
            onTouchTap={this.onChangeSecret.bind(this, false)} />
          {/*
          this.state.isSecret &&
          <div className='text:public-info'>
            タイムラインに表示されなくなります
          </div>
          */}
        </div>
        {/* 送信ボタン */}
        {!this.state.errorImage &&
        <div className='block:submit-message'>
          <input className='input:submit-message'
            type='button'
            value='送信する'
            onTouchTap={this.onSubmit.bind(this)} />
        </div>}
      </div>
    </div>
  }

  state = {
    inputTitle: '',
    inputNote: '',
    inputImage: null,
    errorImage: '',
    inputColors: [],
    inputRate: 0,
    isPublic: false,
    isSecret: false
  }
  process = false

  // タイトルを入力する
  onInputTitle (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    this.setState({inputTitle: value})
  }

  // ノートを入力する
  onInputNote (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 1000) return
    this.setState({inputNote: value})
  }

  // 画像を設定する
  onDropImage (acceptedFiles) {
    if (this.process) return
    this.process = true
    const file = acceptedFiles[0]
    if (!file) {
      this.process = false
      return
    }
    const type = file.type
    const nameArray = file.name.split('.')
    const extension = nameArray[nameArray.length - 1].toLowerCase()
    if (type.indexOf('image') === -1) {
      this.setState({errorImage: 'アップロードできるのはイメージデータのみです'})
      this.process = false
      return
    }
    if (file.size > 5000000) {
      this.setState({errorImage: 'サイズが5MBを超えています'})
      this.process = false
      return
    }
    if (extension !== 'png' && extension !== 'jpg' && extension !== 'jpeg') {
      this.setState({errorImage: '拡張はjpgまたはpngのみです'})
      this.process = false
      return
    }
    this.setState({errorImage: null, inputImage: file})
    this.process = false
  }

  // 画像を削除する
  onCloseImage () {
    this.setState({errorImage: null, inputImage: null})
  }

  // カラーを入力する
  onSelectColor (color, event) {
    event.preventDefault()
    const colors = this.state.inputColors
    if (colors.includes(color)) {
      const next = colors.filter(item => item !== color)
      this.setState({inputColors: next})
    } else {
      if (colors.length > 2) return
      const next = colors
      next.push(color)
      this.setState({inputColors: next})
    }
  }

  // レートを選択する
  onSelectRate (rate, event) {
    event.preventDefault()
    this.setState({inputRate: rate})
  }

  // 投稿の種類をパブリックに変更する
  onChangePublic (bool) {
    this.setState({isPublic: bool})
  }

  // タイムラインの表示設定を変更する
  onChangeSecret (bool) {
    this.setState({isSecret: bool})
  }

  onInputArtwork (event) {
    event.preventDefault()
    const image = this.refs.image
    if (!image) return
    if (image.width === image.height) {
      this.setState({inputArtwork: !this.state.inputArtwork})
    } else {
      this.setState({
        inputArtwork: false,
        errorArtwork: 'アートワークに指定できるのは正方形のデータのみです'
      })
      setTimeout(() => { this.setState({errorArtwork: ''}) }, 5000)
    }
  }

  // メッセージの更新をサーバーに送信する
  onSubmit () {
    if (this.process) return
    this.process = true
    const date = new Date()
    const dateStr = ['' + date.getFullYear(), '' + (date.getMonth() + 1), '' + date.getDate()]
    .map(n => n.length === 1 ? '0' + n : n)
    .join('-')
    if (!this.state.inputImage) {
      this.process = false
      return
    }
    const file = this.state.inputImage
    const nameArray = file.name.split('.')
    const extension = nameArray[nameArray.length - 1].toLowerCase()
    const id = Random.id()
    const imageName = id + '.' + extension
    const imageNameMin = id + '-min.' + extension
    const imageNameCache = imageName + '?uuid=' + Random.id()
    const imageNameCacheMin = imageNameMin + '?uuid=' + Random.id()
    const formdata = new FormData()
    formdata.append('file', file)
    formdata.append('date', dateStr)
    formdata.append('name', imageName)
    formdata.append('name_min', imageNameMin)
    if (Meteor.isDevelopment) {
      if (!Meteor.settings.public.api || !Meteor.settings.public.api.unique) {
        this.props.snackbar.errorMessage('開発環境では画像のアップロードは利用できません')
        this.process = false
        return
      }
      formdata.append('unique', Meteor.settings.public.api.unique)
    }
    new Promise((resolve, reject) => {
      HTTP.post(Meteor.settings.public.api.work.image, {content: formdata}, err => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
    .then(() => {
      const image = {
        full: imageNameCache,
        min: imageNameCacheMin
      }
      return this.props.artworks.insert({
        type: 'illust',
        title: this.state.inputTitle,
        note: this.state.inputNote,
        colors: this.state.inputColors,
        rate: this.state.rate,
        isPublic: this.state.isPublic,
        isSecret: this.state.isSecret,
        image: image,
        imageDate: dateStr
      })
    })
    .then(post => {
      this.props.artworks.insertIndex(post)
      this.props.snackbar.show('投下しました')
      this.setState({
        inputTitle: '',
        inputNote: '',
        inputColors: [],
        errorImage: null,
        inputImage: null
      })
      this.process = false
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }
}
