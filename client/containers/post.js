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
export default class Post extends Component {
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
              dangerouslySetInnerHTML={{__html: this.props.content}}
              component='a'
              href={'/thread/' + (this.props.reply ? this.props.reply._id : this.props._id)} />
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
              <Image src={
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
          {/* res */}
          {this.props.reply &&
          <SheetContent>
            <Sheet minimal hover>
              {/* username */}
              {this.props.reply.public &&
              <SheetContent>
                <Typography component='a' href={'/' + this.props.reply.public.username}>
                  {this.props.reply.public.name}@{this.props.reply.public.username}
                </Typography>
              </SheetContent>}
              {/* content */}
              <SheetContent href={'/thread/' + this.props.reply._id}>
                <Typography
                  className={classes.content}
                  dangerouslySetInnerHTML={{__html: this.props.reply.content}} />
              </SheetContent>
              {this.props.reply.createdAt &&
              <SheetContent>
                <Typography type='caption'> - {utils.date.since(this.props.reply.createdAt)}</Typography>
              </SheetContent>}
            </Sheet>
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
              placeholder={'New Reaction : ' + this.reactionPlaceholder}
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
    isReply: this.props.isReply || false,
    selectImage: false,
    isInputReaction: null,
    inputNewReaction: '',
    iframe: false
  }

  process = false

  embed (data) {
    const {classes} = this.props
    if (!this.state.iframe) {
      return (
        <Sheet minimal hover>
          <SheetActions>
            <Typography type='subheading'>
              {data.title}
            </Typography>
            <Button onClick={this.onOpenIframe.bind(this)}>
              タップして{data.provider_name}を読み込む
            </Button>
          </SheetActions>
        </Sheet>
      )
    }
    switch (data.provider_name) {
      case 'Vine':
      case 'SoundCloud':
        return <div className={classes.oEmbedIframe} dangerouslySetInnerHTML={{__html: data.html}} />
      default:
        return <div className={classes.oEmbed} dangerouslySetInnerHTML={{__html: data.html}} />
    }
  }

  onOpenThread (event) {
    event.persist()
    const nodeName = event.target.nodeName
    if (nodeName === 'INPUT' || nodeName === 'SPAN' || nodeName === 'BUTTON' || nodeName === 'IMG' ||
      nodeName === 'svg' ||
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
