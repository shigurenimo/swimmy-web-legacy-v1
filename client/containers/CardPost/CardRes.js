import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import KeyboardArrowDownIcon from 'material-ui-icons/KeyboardArrowDown'
import KeyboardArrowUpIcon from 'material-ui-icons/KeyboardArrowUp'
import Chip from 'material-ui/Chip'
import TextField from 'material-ui/TextField'
import IconButton from 'material-ui/IconButton'
import Button from '/client/components/Button'
import Image from '/client/components/UI-Image'
import Sheet from '/client/components/UI-Sheet'
import SheetActions from '/client/components/UI-SheetActions'
import SheetContent from '/client/components/UI-SheetContent'
import Typography from '/client/components/Typography'
import utils from '/lib/imports/utils'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('routes', 'accounts', 'posts', 'snackbar')
@observer
export default class PostRes extends Component {
  render () {
    const {classes} = this.props
    return (
      <div>
        <Sheet hover className={classes.sheet} onTouchTap={this.onOpenThread}>
          {/* username */}
          {this.props.owner && this.props.owner.username &&
          <SheetContent>
            <Typography inline
              className={classes.username}
              component='a'
              href={'/' + this.props.owner.username}>
              @{this.props.owner.username}
            </Typography>
          </SheetContent>}
          {/* content */}
          <SheetContent>
            <Typography inline
              className={classes.content}
              dangerouslySetInnerHTML={{__html: this.props.content}} />
            <Typography inline type='caption' component='span'> - {utils.date.since(this.props.createdAt)}</Typography>
          </SheetContent>
          {/* photo */}
          {this.props.imagePath &&
          <SheetContent>
            <div
              className={classNames(classes.photoImage, {
                [classes.photoImageOpen]: this.state.selectImage
              })}
              onTouchTap={this.onSelectImage}>
              <Image src={this.props.imagePath + this.props.images.slice()[0].x256} />
            </div>
          </SheetContent>}
          {/* oEmbed */}
          {this.props.extension.web &&
          this.props.extension.web.oEmbed &&
          <SheetContent>
            {this.embed(this.props.extension.web.oEmbed)}
          </SheetContent>}
          {/* web html */}
          {this.props.extension.web &&
          !this.props.extension.web.oEmbed &&
          this.props.extension.web.html &&
          this.props.extension.web.html['og:image'] &&
          <SheetContent>
            <a href={this.props.extension.web.url} target='_blank'>
              <Image src={this.props.extension.web.html['og:image']} />
            </a>
          </SheetContent>}
          {/* web title */}
          {this.props.extension.web &&
          this.props.extension.web.html &&
          this.props.extension.web.html.title &&
          <SheetContent>
            <Typography
              type='subheading'
              component='a'
              href={this.props.extension.web.url}
              target='_blank'>
              {this.props.extension.web.html.title}
            </Typography>
          </SheetContent>}
          {/* reaction */}
          {this.props.reactions.slice()[0] &&
          <SheetActions>
            <div className={classes.reactionList}>
              {this.props.reactions.map(({name, ownerIds}) =>
                <Chip
                  key={name}
                  className={classNames(classes.chip, {
                    [classes.colorChip]: !!this.props.accounts.isLogged &&
                    ownerIds.includes(this.props.accounts.one._id)
                  })}
                  label={name + ' ' + (ownerIds.length > 0 ? ownerIds.length : '')}
                  onRequestDelete={
                    (!!this.props.accounts.isLogged && ownerIds.includes(this.props.accounts.one._id))
                      ? this.onUpdateReaction.bind(this, this.props._id, name)
                      : null
                  }
                  onClick={this.onUpdateReaction.bind(this, this.props._id, name)} />
              )}
            </div>
          </SheetActions>}
          {/* more */}
          {this.props.accounts.isLogged && (
            <IconButton className={classes.more} onClick={this.onOpenReply}>
              {this.state.isReply
                ? <KeyboardArrowUpIcon className={classes.icon} />
                : <KeyboardArrowDownIcon className={classes.icon} />}
            </IconButton>
          )}
        </Sheet>
        {/* reaction */}
        {this.state.isReply && (
          <Sheet>
            <SheetActions>
              <TextField fullWidth
                value={this.state.inputNewReaction}
                label='new label'
                InputProps={{placeholder: this.reactionPlaceholder}}
                maxLength='10'
                onChange={this.onInputNewReaction} />
            </SheetActions>
            {this.props.accounts.isLogged && (
              <SheetActions dense align='right'>
                {this.props.ownerId === this.props.accounts.one._id && (
                  <Button onClick={this.onRemovePost.bind(this, this.props._id)}>delete post</Button>
                )}
                <Button onClick={this.onSubmitNewReactionLike}>like!</Button>
                <Button onClick={this.onSubmitNewReaction}>stick on!</Button>
              </SheetActions>
            )}
          </Sheet>
        )}
      </div>
    )
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
    const {classes} = this.props
    if (!this.state.iframe) {
      return (
        <Sheet dense background>
          <SheetActions>
            <Typography type='subheading'>
              {data.title}
            </Typography>
            <Button onClick={this.onOpenIframe}>
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
    if (this.props.routes.page === 'thread') return
    event.persist()
    const nodeName = event.target.nodeName
    if (nodeName === 'INPUT' || nodeName === 'BUTTON' || nodeName === 'IMG' || nodeName === 'svg' ||
      nodeName === 'path' || nodeName === 'A') return
    this.props.routes.go('/thread/' + this.props._id)
  }

  onOpenThread = ::this.onOpenThread

  onOpenIframe () {
    this.setState({iframe: true})
  }

  onOpenIframe = ::this.onOpenIframe

  // 写真を選択する
  onSelectImage () {
    this.setState({selectImage: !this.state.selectImage})
  }

  onSelectImage = ::this.onSelectImage

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

  onOpenReply = ::this.onOpenReply

  // 新しいリアクションを入力する
  onInputNewReaction (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 20) return
    this.setState({inputNewReaction: value})
  }

  onInputNewReaction = ::this.onInputNewReaction

  // リアクションを更新する
  onUpdateReaction (postId, name) {
    if (!this.props.accounts.isLogged) {
      this.props.snackbar.requireLogin()
      return
    }
    this.props.posts.updateReaction(postId, name)
    .then(post => {
      this.setState({isReply: false, isInputReaction: false, inputNewReaction: ''})
    })
    .catch(err => this.props.snackbar.error(err.reason))
  }

  // 新しいリアクションを送信する
  onSubmitNewReaction () {
    const postId = this.props._id
    const inputNewReaction = this.state.inputNewReaction
    this.onUpdateReaction(postId, inputNewReaction)
  }

  onSubmitNewReaction = ::this.onSubmitNewReaction

  onSubmitNewReactionLike () {
    const postId = this.props._id
    this.onUpdateReaction(postId, 'スキ')
  }

  onSubmitNewReactionLike = ::this.onSubmitNewReactionLike

  // 投稿を削除する
  onRemovePost (postId) {
    const confirm = window.confirm('削除してもいいですか？')
    if (!confirm) return
    this.props.posts.remove(postId)
    .then(() => {})
    .catch(err => this.props.snackbar.error(err.reason))
  }
}
