import Divider from 'material-ui/Divider'
import withStyles from 'material-ui/styles/withStyles'
import { inject, observer } from 'mobx-react'
import pathToRegexp from 'path-to-regexp'
import compose from 'ramda/src/compose'
import React, { Component } from 'react'
import Dropzone from 'react-dropzone'

import Button from '/imports/client/ui/components/Button'
import Image from '/imports/client/ui/components/Image'
import withCurrentUser from '/imports/client/ui/hocs/withCurrentUser'
import withMethod from '/imports/client/ui/hocs/withMethod'
import withRouter from '/imports/client/ui/hocs/withRouter'
import createBase64 from '/imports/utils/createBase64'

import styles from './index.style'

class InputPost extends Component {
  render () {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <div className={classes.inner}>
          <div className={classes.tools}>
            {this.props.userId &&
            <Button
              dense
              className={classes.spacing}
              selected={this.state.inputIsPublic}
              onClick={this.onChangePublic.bind(this, true)}>
              {this.props.currentUser.username}
            </Button>}
            <Button
              dense
              className={classes.spacing}
              selected={this.props.userId ? !this.state.inputIsPublic : true}
              onClick={this.onChangePublic.bind(this, false)}>
              内緒
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
                onClick={this.onCloseImage}
                style={{maxHeight: '200px', width: 'auto'}} />
            </div>}
          </div>
          <div className={classes.postPublic}>
            {/* image */}
            <Dropzone className={classes.openImage} onDrop={this.onDropImage}>
              <Button dense className={classes.spacing}>
                メディア
              </Button>
            </Dropzone>
            {/* send */}
            {!this.state.errorImage &&
            <Button dense className={classes.spacing} onClick={this.onSubmit}>
              送信
            </Button>}
          </div>
        </div>
        <Divider />
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

  onInputContent = (event) => {
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

  onDropImage = (acceptedFiles) => {
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

  onCloseImage = () => {
    this.setState({errorImage: null, inputImage: null})
    this.props.inputPost.setPostImage(false)
  }

  onChangePublic (bool) {
    this.setState({inputIsPublic: bool})
  }

  onSubmitKeyDown = (event) => {
    if (event.keyCode !== 13 || !event.shiftKey) return
    this.onSubmit()
  }

  onSubmit = () => {
    this.props.router.location.pathname.includes('thread')
      ? this.onSubmitReply()
      : this.onSubmitPost()
  }

  async onSubmitPost () {
    if (this.process) return
    this.process = true
    if (this.state.inputImage) {
      const file = this.state.inputImage
      await createBase64(file)
      .then(base64 => {
        this.props.snackbar.setMessage('サーバーで画像を圧縮しています')
        const data = {
          isPublic: this.state.inputIsPublic,
          content: this.props.inputPost.postContent,
          images: [base64]
        }
        this.props.inputPost.reset()
        this.setState({errorImage: null, inputImage: null})
        this.ref.style.height = 'auto'
        return this.props.insertPost(data)
      })
      .then(this.props.snackbar.setMessage)
      .catch(this.props.snackbar.setError)
    } else {
      if (this.props.inputPost.postContent === '') {
        this.process = false
        return
      }
      const data = {
        isPublic: this.state.inputIsPublic,
        content: this.props.inputPost.postContent
      }
      this.setState({errorImage: null, inputImage: null})
      this.props.inputPost.reset()
      this.ref.style.height = 'auto'
      await this.props.insertPost(data)
      .catch(this.props.snackbar.setError)
    }
    this.process = false
  }

  async onSubmitReply () {
    if (this.process) return
    this.process = true
    const replyId = pathToRegexp('/thread/:postId').exec(this.props.router.location.pathname)[1]
    if (this.state.inputImage) {
      const file = this.state.inputImage
      await createBase64(file)
      .then(base64 => {
        this.props.snackbar.setMessage('サーバーで画像を圧縮しています')
        const data = {
          isPublic: this.state.inputIsPublic,
          content: this.props.inputPost.postContent,
          images: [base64],
          reply: replyId
        }
        this.props.inputPost.reset()
        this.setState({errorImage: null, inputImage: null})
        this.ref.style.height = 'auto'
        return this.props.insertPost(data)
      })
      .catch(this.props.snackbar.setError)
    } else {
      if (this.props.inputPost.postContent === '') {
        this.process = false
        return
      }
      const data = {
        isPublic: this.state.inputIsPublic,
        content: this.props.inputPost.postContent,
        replyId
      }
      this.props.inputPost.reset()
      this.setState({errorImage: null, inputImage: null})
      this.ref.style.height = 'auto'
      await this.props.insertPost(data)
      .catch(this.props.snackbar.setError)
    }
    this.process = false
  }
}

export default compose(
  withStyles(styles),
  inject(stores => ({
    inputPost: stores.inputPost,
    snackbar: stores.snackbar
  })),
  withRouter,
  withCurrentUser,
  withMethod('insertPost'),
  observer
)(InputPost)