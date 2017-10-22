import classNames from 'classnames'
import withStyles from 'material-ui/styles/withStyles'
import Divider from 'material-ui/Divider'
import { inject } from 'mobx-react'
import compose from 'ramda/src/compose'
import React, { Component } from 'react'

import Button from '/imports/client/ui/components/Button'
import ChipPostReaction from '/imports/client/ui/components/ChipPostReaction'
import Image from '/imports/client/ui/components/Image'
import PostReaction from '/imports/client/ui/components/PostReaction'
import Sheet from '/imports/client/ui/components/Sheet'
import SheetActions from '/imports/client/ui/components/SheetActions'
import SheetContent from '/imports/client/ui/components/SheetContent'
import Typography from '/imports/client/ui/components/Typography'
import withRouter from '/imports/client/ui/hocs/withRouter'
import withCurrentUser from '/imports/client/ui/hocs/withCurrentUser'
import withMethod from '/imports/client/ui/hocs/withMethod'
import toSince from '/imports/utils/date/toSince'

import styles from './index.style'

class PostRes extends Component {
  render () {
    const {classes} = this.props
    return (
      <div>
        <Sheet hover onClick={this.onOpenActions}>
          {/* username */}
          <SheetContent>
            {this.props.owner && this.props.owner.username &&
            <Typography
              gutterBottom
              className={classes.username}>
              @{this.props.owner.username}
            </Typography>}
            {/* content */}
            <Typography
              inline
              className={classes.content}
              dangerouslySetInnerHTML={{__html: this.props.content}} />
            <Typography inline type='caption' component='span'> - {toSince(this.props.createdAt)}</Typography>
          </SheetContent>
          {/* photo */}
          {this.props.imagePath &&
          <SheetContent>
            <div
              className={classNames(classes.photoImage, {
                [classes.photoImageOpen]: this.state.selectImage
              })}
              onClick={this.onSelectImage}>
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
          !this.props.extension.web.oEmbed &&
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
                <ChipPostReaction
                  key={name}
                  name={name}
                  ownerIds={ownerIds}
                  postId={this.props.userId}
                  isLogged={this.props.isLogged}
                  onUpdateReaction={() => this.onUpdateReaction(this.props._id, name)} />
              )}
            </div>
          </SheetActions>}
        </Sheet>
        {/* reaction */}
        {this.state.isOpenActions &&
        <PostReaction
          isLogged={this.props.isLogged}
          isOwner={this.props.userId === this.props.ownerId}
          postId={this.props._id}
          replyId={this.props.replyId} />}
        <Divider />
      </div>
    )
  }

  reactionPlaceholder = [
    'エモい', 'それな', 'いいね', 'わかる', 'わぁ',
    'オトナ', '既読', '高まる', 'おやすん'
  ][Math.floor(Math.random() * 9)]

  state = {
    isOpenActions: false,
    selectImage: false,
    inputNewReaction: '',
    iframe: false
  }

  process = false

  embed = (data) => {
    const {classes} = this.props
    if (!this.state.iframe) {
      return (
        <Sheet background>
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

  // リプライを開く
  onOpenActions = (event) => {
    event.persist()
    const nodeName = event.target.nodeName
    switch (nodeName) {
      case 'A':
      case 'BUTTON':
      case 'INPUT':
      case 'IMG':
      case 'SPAN':
      case 'path':
      case 'svg':
        return
    }
    const isThread = this.props.router.location.pathname.includes('thread')
    if (!this.props.isLogged && isThread) { return null }
    if (this.state.isOpenActions) {
      this.setState({isOpenActions: false})
    } else {
      this.setState({isOpenActions: true})
    }
  }

  onOpenIframe = () => {
    this.setState({iframe: true})
  }

  // 写真を選択する
  onSelectImage = () => {
    this.setState({selectImage: !this.state.selectImage})
  }

  // リアクションを更新する
  onUpdateReaction = (postId, name) => {
    if (!this.props.isLogged) {
      this.props.snackbar.requireLogin()
      return
    }
    this.props.updatePostReaction(postId, {name})
    .then(() => {
      this.setState({isOpenActions: false, isInputReaction: false, inputNewReaction: ''})
    })
    .catch(this.props.snackbar.setError)
  }
}

export default compose(
  withStyles(styles),
  inject(stores => ({snackbar: stores.snackbar})),
  withCurrentUser,
  withRouter,
  withMethod('updatePostReaction'),
  withMethod('removePost')
)(PostRes)
