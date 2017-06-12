import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import IconKeyboardArrowDown from 'material-ui-icons/KeyboardArrowDown'
import IconKeyboardArrowUp from 'material-ui-icons/KeyboardArrowUp'
import Typography from 'material-ui/Typography'
import Input from 'material-ui/Input'
import Button from '../components/ui-input-button'
import Image from '../components/ui-image'
import Sheet from '../components/ui-sheet'
import SheetActions from '../components/ui-sheet-actions'
import SheetContent from '../components/ui-sheet-content'
import utils from '../../imports/utils'
import styleSheet from './post.style'

@withStyles(styleSheet)
@inject('router', 'user', 'posts', 'snackbar')
@observer
export default class PostRes extends Component {
  render () {
    const {classes} = this.props
    return (
      <div>
        <Sheet hover onTouchTap={this.onOpenThread.bind(this)}>
          {/* username */}
          {this.props.public &&
          <SheetContent>
            <Typography component='a' href={'/' + this.props.public.username}>
              {this.props.public.name}@{this.props.public.username}
            </Typography>
          </SheetContent>}
          {/* content */}
          <SheetContent>
            <Typography
              className={classes.content}
              dangerouslySetInnerHTML={{__html: this.props.content}} />
          </SheetContent>
          <SheetContent>
            <Typography type='caption'> - {utils.date.since(this.props.createdAt)}</Typography>
          </SheetContent>
          {/* photo */}
          {this.props.images && this.props.images.slice()[0] &&
          <SheetContent>
            <div
              className={classNames(classes.photoImage, {
                [classes.photoImageOpen]: this.state.selectImage
              })}
              onTouchTap={this.onSelectImage.bind(this)}>
              <Image
                src={
                  Meteor.settings.public.assets.post.image +
                  this.props.imagesDate + '/' +
                  this.props.images.slice()[0].min
                } />
            </div>
          </SheetContent>}
          {/* oEmbed */}
          {this.props.oEmbed &&
          <SheetContent>
            {this.props.oEmbed && this.embed(this.props.oEmbed)}
          </SheetContent>}
          {/* web meta */}
          {this.props.web && this.props.web.meta['og:image'] &&
          <SheetContent>
            <a href={this.props.url} target='_blank'>
              <Image src={this.props.web.meta['og:image']} />
            </a>
          </SheetContent>}
          {/* web title */}
          {this.props.web && this.props.web.title &&
          <SheetContent>
            <Typography
              type='subheading'
              component='a'
              href={this.props.url}
              target='_blank'>
              {this.props.web.title}
            </Typography>
          </SheetContent>}
          {/* reaction */}
          <SheetActions>
            {Object.keys(this.props.reactions).map(name =>
              <Button compact minimal background
                key={name}
                primary={!!this.props.user.isLogged && this.props.reactions[name].includes(this.props.user._id)}
                onClick={this.onUpdateReaction.bind(this, this.props._id, name)}>
                {name + (this.props.reactions[name].length > 0 ? ' ' + this.props.reactions[name].length : '')}
              </Button>
            )}
          </SheetActions>
          {/* more */}
          {this.props.user.isLogged &&
          <Button compact className={classes.more} onClick={this.onOpenReply.bind(this)}>
            {this.state.isReply
              ? <IconKeyboardArrowUp {...this.iconStyle} />
              : <IconKeyboardArrowDown {...this.iconStyle} />}
          </Button>}
        </Sheet>
        {/* reaction */}
        {this.state.isReply &&
        <Sheet>
          <SheetActions>
            <Input
              value={this.state.inputNewReaction}
              placeholder={'new reaction : ' + this.reactionPlaceholder}
              maxLength='10'
              onChange={this.onInputNewReaction.bind(this)} />
          </SheetActions>
          <SheetActions align='right'>
            {this.props.user.isLogged &&
            this.state.isReply &&
            (this.props.owner === this.props.user._id) &&
            <Button onClick={this.onRemovePost.bind(this, this.props._id)}>delete</Button>}
            <Button onClick={this.onSubmitNewReaction.bind(this)}>push</Button>
          </SheetActions>
        </Sheet>}
      </div>
    )
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
    isReply: false,
    selectImage: false,
    inputNewReaction: '',
    iframe: false
  }

  process = false

  embed (data) {
    if (!this.state.iframe) {
      return <div className='block:oEmbed-echo'>
        <button className='input:oEmbed-echo' onTouchTap={this.onOpenIframe.bind(this)}>
          {data.title}<br />
          タップして{data.provider_name}を読み込む
        </button>
      </div>
    }
    switch (data.provider_name) {
      case 'Vine':
      case 'SoundCloud':
        return <div
          className='block:oEmbed-iframe'
          dangerouslySetInnerHTML={{__html: data.html}}></div>
      default:
        return <div
          className='block:oEmbed'
          dangerouslySetInnerHTML={{__html: data.html}}></div>
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
    event.persist()
    const nodeName = event.target.nodeName
    if (nodeName === 'INPUT' || nodeName === 'IMG' || nodeName === 'A') return
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
    const replyId = this.props.posts.one._id
    if (!this.props.user.isLogged) {
      this.props.snackbar.requireLogin()
      return
    }
    this.props.posts.updateReaction(postId, name)
    .then(post => {
      this.props.posts.insertIndex(post)
      this.setState({isReply: false, isInputReaction: false, inputNewReaction: ''})
      return this.props.posts.fetchOneFromId(replyId)
    })
    .then(post => {
      this.props.posts.updateOne(post)
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
    const replyId = this.props.posts.one._id
    const confirm = window.confirm('削除してもいいですか？')
    if (!confirm) return
    this.props.posts.remove(postId)
    .then(() => {
      this.props.posts.removeIndex(postId)
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
