import { Meteor } from 'meteor/meteor'
import { HTTP } from 'meteor/http'
import { Random } from 'meteor/random'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import IconAdd from 'material-ui/svg-icons/content/add'

@inject('inputPost', 'layout', 'networks', 'posts', 'snackbar', 'router', 'user')
@observer
class InputPost extends Component {
  render () {
    return <div
      className={`container:input-post ${this.props.layout.oneColumnClassName}`}>
      {/* 匿名 */}
      <div className='block:timeline-name'>
        <div className={`input:timeline-name ${this.props.posts.networkInfo}`}
          onTouchTap={this.openNetworkInfo.bind(this)}>
          {this.timelineName}
        </div>
      </div>
      <div className='block:message'>
          <textarea
            className='input:post-content'
            value={this.props.inputPost.postContent}
            placeholder='ここタップすると入力できます'
            ref='textarea'
            onKeyDown={this.onSubmitKeyDown.bind(this)}
            onChange={this.onInputContent.bind(this)}/>
        {this.state.inputImage &&
        <div className='block:image-preview'>
          <img src={this.state.inputImage.preview} onTouchTap={this.onCloseImage.bind(this)}/>
        </div>}
      </div>
      <div className='block:post-public'>
        <Dropzone
          className='input:open-image'
          onDrop={this.onDropImage.bind(this)}>
          <IconAdd style={{width: 25, height: 25}}
            color={Meteor.settings.public.color.primary}/>
        </Dropzone>
        {this.props.user.isLogged &&
        <input className={'input:public ' + this.state.inputIsPublic}
          type='button'
          value={this.props.user.username}
          onTouchTap={this.onChangePublic.bind(this, true)}/>}
        {this.props.user.isLogged &&
        <input className={'input:public ' + !this.state.inputIsPublic}
          type='button'
          value='内緒'
          onTouchTap={this.onChangePublic.bind(this, false)}/>}
        {/* 送信ボタン */}
        {!this.state.errorImage &&
        <input className='input:post-submit'
          type='button'
          value='GOGO!'
          onTouchTap={this.onSubmit.bind(this)}/>}
      </div>
    </div>
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

  // 内容を入力する
  onInputContent (event) {
    const textarea = this.refs.textarea
    if (textarea.scrollHeight > 200) return
    textarea.style.height = 'auto'
    textarea.style.height = textarea.scrollHeight + 'px'
    event.persist()
    let value = event.target.value
    if (value.length > 1000) return
    this.props.inputPost.setPostContentHeight(textarea.scrollHeight)
    this.props.inputPost.setPostContent(value)
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
    this.props.inputPost.setPostImage(true)
    this.process = false
  }

  // 画像を削除する
  onCloseImage () {
    this.setState({errorImage: null, inputImage: null})
    this.props.inputPost.setPostImage(false)
  }

  // 公開・非公開を変更する
  onChangePublic (bool) {
    this.setState({inputIsPublic: bool})
  }

  onSubmitKeyDown (event) {
    if (event.keyCode !== 13 || !event.shiftKey) return
    this.onSubmit()
  }

  onSubmit () {
    this.props.router.page === 'thread'
      ? this.onSubmitReply()
      : this.onSubmitPost()
  }

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
        this.refs.textarea.style.height = 'auto'
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
        this.refs.textarea.style.height = 'auto'
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

export { InputPost }
