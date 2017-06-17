import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import { Random } from 'meteor/random'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import IconAdd from 'material-ui-icons/Add'
import Button from '../components/ui-button'
import Image from '../components/ui-image'
import styleSheet from './input-post.style'

@withStyles(styleSheet)
@inject('inputPost', 'layout', 'networks', 'posts', 'snackbar', 'router', 'users')
@observer
export default class InputPost extends Component {
  render () {
    const {
      classes,
      layout
    } = this.props
    return (
      <div
        className={classNames(classes.container, {
          [classes.oneColumn]: layout.oneColumn,
          [classes.twoColumn]: !layout.oneColumn
        })}>
        {/* 匿名 */}
        <div className={classes.timelineName}>
          <Button background minimal
            primary={this.props.posts.networkInfo}
            onClick={this.openNetworkInfo}>
            {this.timelineName}
          </Button>
        </div>
        <div className={classes.message}>
          <textarea
            className={classes.postContent}
            value={this.props.inputPost.postContent}
            placeholder='ここタップすると入力できます'
            ref={self => { this.ref = self }}
            onKeyDown={this.onSubmitKeyDown}
            onChange={this.onInputContent} />
          {this.state.inputImage &&
          <div className={classes.imagePreview}>
            <Image
              src={this.state.inputImage.preview}
              onTouchTap={this.onCloseImage} />
          </div>}
        </div>
        <div className={classes.postPublic}>
          <Button compact>
            <Dropzone
              className={classes.openImage}
              onDrop={this.onDropImage.bind(this)}>
              <IconAdd style={{width: 25, height: 25}}
                color={Meteor.settings.public.color.primary} />
            </Dropzone>
          </Button>
          {this.props.users.isLogged &&
          <Button compact
            primary={this.state.inputIsPublic}
            onClick={this.onChangePublic.bind(this, true)}>
            {this.props.users.one.username}
          </Button>}
          {this.props.users.isLogged &&
          <Button compact
            primary={!this.state.inputIsPublic}
            onClick={this.onChangePublic.bind(this, false)}>
            secret
          </Button>}
          {/* 送信ボタン */}
          {!this.state.errorImage &&
          <Button compact onClick={this.onSubmit}>
            GOGO!
          </Button>}
        </div>
      </div>
    )
  }

  state = {
    isPublic: false,
    inputImage: null,
    inputIsPublic: false,
    errorImage: ''
  }

  process = false

  get timelineName () {
    if (this.props.router.page === 'thread') {
      if (this.props.posts.one.networkInfo) {
        return this.props.posts.one.networkInfo.name
      } else {
        return 'レス'
      }
    }
    return this.props.posts.timeline.name
  }

  openNetworkInfo () {
    const networkId = this.props.posts.timeline.network ||
      (this.props.router.page === 'thread' && this.props.posts.one.network)
    if (!networkId) return
    if (this.props.posts.networkInfo) {
      this.props.posts.closeNetworkInfo()
    } else {
      this.props.networks.fetchOneFromId(networkId)
      .then(network => {
        this.props.networks.updateOne(network)
        this.props.posts.openNetworkInfo()
      })
      .catch(err => {
        this.props.snackbar.error(err)
      })
    }
  }

  openNetworkInfo = ::this.openNetworkInfo

  // 内容を入力する
  onInputContent (event) {
    const textarea = this.ref
    if (textarea.scrollHeight > 200) return
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
    event.persist()
    let value = event.target.value
    if (value.length > 1000) return
    this.props.inputPost.setPostContentHeight(textarea.scrollHeight)
    this.props.inputPost.setPostContent(value)
  }

  onInputContent = ::this.onInputContent

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
    this.props.inputPost.setPostImage(true)
    this.process = false
  }

  // 画像を削除する
  onCloseImage () {
    this.setState({errorImage: null, inputImage: null})
    this.props.inputPost.setPostImage(false)
  }

  onCloseImage = ::this.onCloseImage

  // 公開・非公開を変更する
  onChangePublic (bool) {
    this.setState({inputIsPublic: bool})
  }

  onSubmitKeyDown (event) {
    if (event.keyCode !== 13 || !event.shiftKey) return
    this.onSubmit()
  }

  onSubmitKeyDown = ::this.onSubmitKeyDown

  onSubmit () {
    this.props.router.page === 'thread'
      ? this.onSubmitReply()
      : this.onSubmitPost()
  }

  onSubmit = ::this.onSubmit

  onSubmitPost () {
    if (this.process) return
    this.process = true
    const date = new Date()
    const dateStr = ['' + date.getFullYear(), '' + (date.getMonth() + 1), '' + date.getDate()]
    .map(n => n.length === 1 ? '0' + n : n)
    .join('-')
    if (this.state.inputImage) {
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
        HTTP.post(Meteor.settings.public.api.post.image, {content: formdata}, err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
      .then(() => {
        return this.props.posts.insert({
          isPublic: this.state.inputIsPublic,
          content: this.props.inputPost.postContent,
          images: [{
            full: imageNameCache,
            min: imageNameCacheMin
          }],
          imagesDate: dateStr
        })
      })
      .then(post => {
        this.ref.style.height = 'auto'
        this.props.posts.insertIndex(post)
        this.props.inputPost.reset()
        this.props.snackbar.show('送信しました')
        this.setState({errorImage: null, inputImage: null})
        this.process = false
      })
      .catch(err => {
        this.props.snackbar.error(err)
        this.process = false
      })
    } else {
      this.props.posts.insert({
        isPublic: this.state.inputIsPublic,
        content: this.props.inputPost.postContent
      })
      .then(post => {
        this.ref.style.height = 'auto'
        this.props.posts.insertIndex(post)
        this.props.inputPost.reset()
        this.props.snackbar.show('送信しました')
        this.setState({errorImage: null, inputImage: null})
        this.process = false
      })
      .catch(err => {
        this.props.snackbar.error(err)
        this.process = false
      })
    }
  }

  onSubmitReply () {
    if (this.process) return
    this.process = true
    const date = new Date()
    const dateStr = ['' + date.getFullYear(), '' + (date.getMonth() + 1), '' + date.getDate()]
    .map(n => n.length === 1 ? '0' + n : n)
    .join('-')
    if (this.state.inputImage) {
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
        HTTP.post(Meteor.settings.public.api.post.image, {content: formdata}, err => {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
      })
      .then(() => {
        const replyId = this.props.posts.one._id
        return this.props.posts.insert({
          isPublic: this.state.inputIsPublic,
          content: this.props.inputPost.postContent,
          images: [{
            full: imageNameCache,
            min: imageNameCacheMin
          }],
          imagesDate: dateStr,
          reply: replyId
        })
      })
      .then(post => {
        this.ref.style.height = 'auto'
        this.props.posts.insertIndex(post)
        this.props.inputPost.reset()
        this.props.snackbar.show('送信しました')
        this.setState({errorImage: null, inputImage: null})
        const replyId = this.props.posts.one._id
        return this.props.posts.fetchOneFromId(replyId)
      })
      .then(post => {
        this.props.posts.updateOne(post)
      })
      .catch(err => {
        this.props.snackbar.error(err)
        this.process = false
      })
    } else {
      const replyId = this.props.posts.one._id
      this.props.posts.insert({
        isPublic: this.state.inputIsPublic,
        content: this.props.inputPost.postContent,
        reply: replyId
      })
      .then(posts => {
        this.props.posts.insertIndex(posts)
        this.props.inputPost.reset()
        this.props.snackbar.show('送信しました')
        this.setState({errorImage: null, inputImage: null})
        return this.props.posts.fetchOneFromId(replyId)
      })
      .then(post => {
        this.props.posts.updateOne(post)
      })
      .catch(err => {
        this.props.snackbar.error(err)
      })
    }
  }
}
