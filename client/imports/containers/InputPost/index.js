import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import classNames from 'classnames'
import utils from '/lib/imports/utils'
import { withStyles } from 'material-ui/styles'
import Button from '../../components/Button'
import Image from '../../components/UI-Image'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject(stores => {
  return {
    inputPost: stores.inputPost,
    layout: stores.layout,
    networks: stores.networks,
    posts: stores.posts,
    snackbar: stores.snackbar,
    router: stores.router,
    accounts: stores.accounts,
    timelines: stores.timelines,
    info: stores.info
  }
})
@observer
export default class InputPost extends Component {
  render () {
    const {classes, layout} = this.props
    return (
      <div
        className={classNames(classes.container, {
          [classes.oneColumn]: layout.oneColumn,
          [classes.twoColumn]: !layout.oneColumn
        })}>
        {/* 匿名 */}
        <div className={classes.tools}>
          <Button dense
            className={classes.spacing}
            selected={this.props.timelines.networkId}
            onClick={this.openNetworkInfo}>
            {this.timelineName}
          </Button>
        </div>
        <div className={classes.message}>
          <textarea
            className={classes.postContent}
            value={this.props.inputPost.postContent}
            placeholder='ここタップして入力する'
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
          {this.props.accounts.isLogged &&
          <Button dense
            className={classes.spacing}
            selected={this.state.inputIsPublic}
            onClick={this.onChangePublic.bind(this, true)}>
            {this.props.accounts.one.username}
          </Button>}
          {this.props.accounts.isLogged &&
          <Button dense
            className={classes.spacing}
            selected={!this.state.inputIsPublic}
            onClick={this.onChangePublic.bind(this, false)}>
            secret
          </Button>}
          {/* image */}
          <Dropzone
            className={classes.openImage}
            onDrop={this.onDropImage}>
            <Button dense className={classes.spacing}>image</Button>
          </Dropzone>
          {/* send */}
          {!this.state.errorImage &&
          <Button dense className={classes.spacing} onClick={this.onSubmit}>
            send
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
      if (this.props.timelines.networkId) {
        return this.props.timelines.name
      } else {
        return 'レス'
      }
    }
    return this.props.timelines.name
  }

  openNetworkInfo () {
    const networkId = this.props.timelines.networkId ||
      (this.props.router.page === 'thread' && this.props.posts.one.networkId)
    if (!networkId) return
    if (this.props.info.isOpen) {
      this.props.info.close()
    } else {
      this.props.networks.findOneFromId(networkId)
      .then(network => {
        this.props.info.setNetwork(network)
        this.props.networks.replaceOne(network)
      })
      .catch(err => this.props.snackbar.error(err.reason))
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

  onDropImage = ::this.onDropImage

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
    if (this.state.inputImage) {
      const file = this.state.inputImage
      utils.createBase64(file)
      .then(base64 => {
        this.props.snackbar.show('サーバーで画像を圧縮しています')
        this.props.inputPost.reset()
        this.setState({errorImage: null, inputImage: null})
        this.ref.style.height = 'auto'
        return this.props.posts.insert({
          isPublic: this.state.inputIsPublic,
          content: this.props.inputPost.postContent,
          images: [base64],
          networkId: this.props.timelines.networkId
        })
      })
      .then(post => {
        this.props.posts.pushIndex(post)
        this.props.snackbar.show('投稿が完了しました')
        this.process = false
      })
      .catch(err => {
        this.props.snackbar.error(err.reason)
        this.process = false
      })
    } else {
      this.props.posts.insert({
        isPublic: this.state.inputIsPublic,
        content: this.props.inputPost.postContent,
        networkId: this.props.timelines.networkId
      })
      .then(post => {
        this.props.posts.pushIndex(post)
        this.props.inputPost.reset()
        this.ref.style.height = 'auto'
        this.props.snackbar.show('送信しました')
        this.setState({errorImage: null, inputImage: null})
        this.process = false
      })
      .catch(err => {
        this.props.snackbar.error(err.reason)
        this.process = false
      })
    }
  }

  onSubmitReply () {
    if (this.process) return
    this.process = true
    if (this.state.inputImage) {
      const file = this.state.inputImage
      utils.createBase64(file)
      .then(base64 => {
        this.props.snackbar.show('サーバーで画像を圧縮しています')
        this.props.inputPost.reset()
        this.setState({errorImage: null, inputImage: null})
        this.ref.style.height = 'auto'
        const replyId = this.props.posts.one._id
        return this.props.posts.insert({
          isPublic: this.state.inputIsPublic,
          content: this.props.inputPost.postContent,
          images: [base64],
          reply: replyId
        })
      })
      .then(post => {
        this.props.posts.pushIndex(post)
        this.props.snackbar.show('投稿が完了しました')
        const replyId = this.props.posts.one._id
        return this.props.posts.findOneFromId(replyId)
      })
      .then(post => {
        this.props.posts.replaceOne(post)
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
        replyId
      })
      .then(posts => {
        this.props.posts.pushIndex(posts)
        this.props.inputPost.reset()
        this.props.snackbar.show('送信しました')
        this.setState({errorImage: null, inputImage: null})
        return this.props.posts.findOneFromId(replyId)
      })
      .then(post => {
        this.props.posts.replaceOne(post)
      })
      .catch(err => {
        this.props.snackbar.error(err)
      })
    }
  }
}
