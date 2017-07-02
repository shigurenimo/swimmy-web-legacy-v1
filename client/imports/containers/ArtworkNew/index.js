import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import { Random } from 'meteor/random'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import Typography from 'material-ui/Typography'
import Button from '../../components/Button'
import TextField from '../../components/TextField'
import UIDropzone from '../../components/UI-Dropzone'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetActions from '../../components/UI-SheetActions'
import SheetContent from '../../components/UI-SheetContent'
import utils from '/lib/utils'

@inject('artworks', 'snackbar', 'accounts')
@observer
export default class ArtworkNew extends Component {
  render () {
    return (
      <Layout>
        <Sheet>
          {/* 画像の投稿 */}
          <SheetActions>
            <UIDropzone
              onDrop={this.onDropImage.bind(this)}
              image={this.state.inputImage}
              text='画像をドロップ or タップ' />
          </SheetActions>
          {/* エラーメッセージ */}
          {this.state.errorImage &&
          <SheetContent>
            <Typography>{this.state.errorImage}</Typography>
          </SheetContent>}
        </Sheet>
        <Sheet>
          {/* title */}
          <SheetActions>
            <TextField fullWidth
              label='title'
              value={this.state.inputTitle}
              maxLength='100'
              onChange={this.onInputTitle} />
          </SheetActions>
        </Sheet>
        <Sheet>
          {/* ノート */}
          <SheetActions>
            <TextField multiline fullWidth
              label='note'
              onChange={this.onInputNote}
              maxLength='1000'
              value={this.state.inputNote} />
          </SheetActions>
        </Sheet>
        {/* color */}
        {/*
         <Sheet>
         <SheetActions>
         {utils.colors.cmyk.map(code =>
         <CheckBox
         key={code}
         checked={this.state.inputColors.includes(code)}
         onChange={this.onSelectColor.bind(this, code)}
         icon={
         <Avatar style={{color: '#' + code, background: 'rgba(0, 0, 0, 0.05)'}}>
         <IconAdd />
         </Avatar>
         }
         checkedIcon={
         <Avatar style={{background: '#' + code}}>
         <IconClear />
         </Avatar>
         } />)}
         </SheetActions>
         </Sheet>
         */}
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
        <Sheet>
          <SheetActions>
            <Button
              selected={this.state.isPublic}
              onClick={this.onChangePublic.bind(this, true)}>{this.props.accounts.one.username}</Button>
            <Button
              selected={!this.state.isPublic}
              onClick={this.onChangePublic.bind(this, false)}>secret</Button>
          </SheetActions>
        </Sheet>
        {/* タイムラインの表示 */}
        {/*
         <Sheet>
         <SheetActions>
         <Button
         selected={this.state.isSecret}
         onClick={this.onChangeSecret.bind(this, true)}>show timeline</Button>
         <Button
         selected={!this.state.isSecret}
         onClick={this.onChangeSecret.bind(this, false)}>hide</Button>
         </SheetActions>
         </Sheet>
         */}
        <Sheet>
          {/* 送信ボタン */}
          {!this.state.errorImage &&
          <SheetActions align='right'>
            <Button onClick={this.onSubmit}>send</Button>
          </SheetActions>}
        </Sheet>
      </Layout>
    )
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

  onInputTitle = ::this.onInputTitle

  // ノートを入力する
  onInputNote (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 1000) return
    this.setState({inputNote: value})
  }

  onInputNote = ::this.onInputNote

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

  onInputArtwork = ::this.onInputArtwork

  // メッセージの更新をサーバーに送信する
  onSubmit () {
    if (this.process) return
    this.process = true
    if (!this.state.inputImage) {
      this.process = false
      return
    }
    const file = this.state.inputImage
    utils.createBase64(file)
    .then(base64 => {
      this.props.snackbar.show('画像の圧縮を開始します')
      this.setState({
        inputTitle: '',
        inputNote: '',
        inputColors: [],
        errorImage: null,
        inputImage: null
      })
      return this.props.artworks.insert({
        type: 'illust',
        title: this.state.inputTitle,
        note: this.state.inputNote,
        colors: this.state.inputColors,
        rate: this.state.rate,
        isPublic: this.state.isPublic,
        isSecret: this.state.isSecret,
        image: base64
      })
    })
    .then(post => {
      this.props.artworks.pushIndex(post)
      this.props.snackbar.show('投稿が完了しました')
      this.process = false
    })
    .catch(err => this.props.snackbar.error(err.reason))
  }

  onSubmit = ::this.onSubmit
}
