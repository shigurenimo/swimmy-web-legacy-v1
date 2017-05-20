import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import IconKeyboardArrowDown from 'material-ui-icons/KeyboardArrowDown'
import IconKeyboardArrowUp from 'material-ui-icons/KeyboardArrowUp'
import { utils } from '../../imports/utils'

@inject('router', 'user', 'posts', 'snackbar')
@observer
class Post extends Component {
  render () {
    return <div className='container:post'>
      <div className='block:layout' onTouchTap={this.onOpenThread.bind(this)}>
        {/* メッセージ コンテンツ */}
        <div className='block:content-layout'>
          {/* リスト */}
          {this.props.publicNetwork &&
          <a className='block:public-name' href={'/network/' + this.props.publicNetwork._id}>
            <p className='text:public-name'>{this.props.publicNetwork.name}</p>
          </a>}
          {/* ユーザネーム */}
          {this.props.public &&
          <a className='block:public-name' href={'/' + this.props.public.username}>
            <p className='text:public-name'>{this.props.public.name}</p>
            <div className='text:public-username'>@{this.props.public.username}</div>
          </a>}
          {/* コンテント */}
          <a className='text:content' href={'/thread/' + (this.props.reply ? this.props.reply._id : this.props._id)}>
            <p dangerouslySetInnerHTML={{__html: this.props.content}}/>
            <span className='text:date'> - {utils.date.since(this.props.createdAt)}</span>
          </a>
        </div>
        {/* フォト */}
        {this.props.images && this.props.images.slice()[0] &&
        <button className={'block:image ' + this.state.selectImage}
          onTouchTap={this.onSelectImage.bind(this)}>
          <img
            src={Meteor.settings.public.assets.post.image + this.props.imagesDate + '/' +
            this.props.images.slice()[0].min}/>
        </button>}
        {/* oEmbed */}
        {this.props.oEmbed && this.state.iframe &&
        <div className='text:service-name'>{this.props.oEmbed.provider_name}</div>}
        {this.props.oEmbed && this.embed(this.props.oEmbed)}
        {this.props.web &&
        this.props.web.meta['og:image'] &&
        <a href={this.props.url} target='_blank'>
          <img className='image:web-image' src={this.props.web.meta['og:image']}/>
        </a>}
        {this.props.web && this.props.web.title &&
        <a href={this.props.url} target='_blank'>
          <div className='text:web-title'>{this.props.web.title}</div>
        </a>}
        {/* レス */}
        {this.props.reply &&
        <div className='block:reply-post'>
          {/* ユーザネーム */}
          {this.props.reply.public &&
          <a className='block:public-name' href={'/' + this.props.reply.public.username}>
            <div className='text:public-name'>{this.props.reply.public.name}</div>
            <div className='text:public-username'>@{this.props.reply.public.username}</div>
          </a>}
          {/* コンテント */}
          <a className='text:content' href={'/thread/' + this.props.reply._id}>
            <p dangerouslySetInnerHTML={{__html: this.props.reply.content}}/>
            {this.props.reply.createdAt &&
            <span className='text:date'> - {utils.date.since(this.props.reply.createdAt)}</span>}
          </a>
        </div>}
        {/* リアクションボタン */}
        <div className='block:reaction-list'>
          {Object.keys(this.props.reactions).map(name =>
            <input
              className={'input:reaction ' +
              (!!this.props.user.isLogged && this.props.reactions[name].includes(this.props.user._id))}
              key={name}
              onTouchTap={this.onUpdateReaction.bind(this, this.props._id, name)}
              type='button'
              value={name + (this.props.reactions[name].length > 0 ? ' ' + this.props.reactions[name].length : '')}/>)}
        </div>
        {this.props.user.isLogged &&
        <button className='input:add-reaction' onTouchTap={this.onOpenReply.bind(this)}>
          {this.state.isReply
            ? <IconKeyboardArrowUp {...this.iconStyle}/>
            : <IconKeyboardArrowDown {...this.iconStyle}/>}
        </button>}
      </div>
      {/* リアクションボタンの編集 */}
      {this.state.isReply &&
      <div className='block:new-reaction'>
        <input
          className='input:new-reaction'
          type='text'
          value={this.state.inputNewReaction}
          placeholder={this.reactionPlaceholder}
          maxLength='10'
          onChange={this.onInputNewReaction.bind(this)}/>
        <input className='input:submit-reaction'
          type='button'
          value='up'
          onTouchTap={this.onSubmitNewReaction.bind(this)}/>
        {/* 修正 */}
        {this.props.user.isLogged &&
        this.state.isReply &&
        (this.props.owner === this.props.user._id) &&
        <input
          className='input:delete'
          type='button'
          value='削除する'
          onTouchTap={this.onRemovePost.bind(this, this.props._id)}/>}
      </div>}
    </div>
  }

  get iconStyle () {
    return {
      style: {
        width: 30,
        height: 30
      },
      color: Meteor.settings.public.color.primary
    }
  }

  reactionPlaceholder = [
    'エモい', 'それな', 'いいね', 'わかる', 'わぁ',
    'オトナ', '既読', '高まる', 'おやすん'
  ][Math.floor(Math.random() * 9)]

  state = {
    isReply: this.props.isReply || false,
    selectImage: false,
    isInputReaction: null,
    inputNewReaction: '',
    iframe: false
  }

  process = false

  embed (data) {
    if (!this.state.iframe) {
      return <div className='block:oEmbed-echo'>
        <button className='input:oEmbed-echo' onTouchTap={this.onOpenIframe.bind(this)}>
          {data.title}<br/>
          タップして{data.provider_name}を読み込む
        </button>
      </div>
    }
    switch (data.provider_name) {
      case 'Vine':
      case 'SoundCloud':
        return <div
          className='block:oEmbed-iframe'
          dangerouslySetInnerHTML={{__html: data.html}}/>
      default:
        return <div
          className='block:oEmbed'
          dangerouslySetInnerHTML={{__html: data.html}}/>
    }
  }

  onOpenThread (event) {
    event.persist()
    const nodeName = event.target.nodeName
    if (nodeName === 'INPUT' || nodeName === 'BUTTON' || nodeName === 'IMG' || nodeName === 'svg' ||
      nodeName === 'path' || nodeName === 'A') return
    FlowRouter.go('/thread/' + this.props._id)
  }

  onOpenIframe () {
    this.setState({iframe: true})
  }

  // 写真を選択する
  onSelectImage () {
    this.setState({selectImage: !this.state.selectImage})
  }

  // リプライを開く
  onOpenReply (event) {
    event.preventDefault()
    if (this.state.isReply) {
      this.setState({isReply: false})
    } else {
      this.setState({isReply: true, inputReply: ''})
    }
  }

  // 新しいリアクションを入力する
  onInputNewReaction (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 20) return
    this.setState({inputNewReaction: value})
  }

  // リアクションを更新する
  onUpdateReaction (postId, name) {
    if (!this.props.user.isLogged) {
      this.props.snackbar.requireLogin()
      return
    }
    if (this.props.router.page === 'thread') {
      this.props.posts.updateReaction(postId, name)
      .then(post => {
        this.setState({isInputReaction: false, inputNewReaction: ''})
        return this.props.posts.fetchOneFromId(postId)
      })
      .then(post => {
        this.props.posts.updateOne(post)
      })
      .catch(err => {
        this.props.snackbar.error(err)
      })
      return
    }
    this.props.posts.updateReaction(postId, name)
    .then(post => {
      this.props.posts.updateOne(post)
      this.props.posts.updateIndex(post._id, post)
      this.setState({isReply: false, isInputReaction: false, inputNewReaction: ''})
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  // 新しいリアクションを送信する
  onSubmitNewReaction () {
    const postId = this.props._id
    const inputNewReaction = this.state.inputNewReaction
    this.onUpdateReaction(postId, inputNewReaction)
  }

  // 投稿を削除する
  onRemovePost (postId) {
    const confirm = window.confirm('削除してもいいですか？')
    if (!confirm) return
    this.props.posts.remove(postId)
    .then(() => {
      this.props.posts.removeIndex(postId)
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }
}

export { Post }
