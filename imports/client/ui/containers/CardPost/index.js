import classNames from 'classnames'
import Divider from 'material-ui/Divider'
import withStyles from 'material-ui/styles/withStyles'
import { inject } from 'mobx-react'
import compose from 'ramda/src/compose'
import React, { Component } from 'react'

import Button from '/imports/client/ui/components/Button'
import ChipPostReaction from '/imports/client/ui/components/ChipPostReaction'
import Image from '/imports/client/ui/components/UI-Image'
import PostReaction from '/imports/client/ui/components/PostReaction'
import Sheet from '/imports/client/ui/components/UI-Sheet'
import SheetActions from '/imports/client/ui/components/UI-SheetActions'
import SheetContent from '/imports/client/ui/components/UI-SheetContent'
import Typography from '/imports/client/ui/components/Typography'
import withRouter from '/imports/client/ui/hocs/withRouter'
import withCurrentUser from '/imports/client/ui/hocs/withCurrentUser'
import withMethod from '/imports/client/ui/hocs/withMethod'
import utils from '/imports/utils'
import styles from './index.style'

class Post extends Component {
  render () {
    const {classes} = this.props
    return (
      <div>
        <Sheet hover onClick={this.onOpenActions}>
          {/* username */}
          {this.props.owner && this.props.owner.username &&
          <SheetContent>
            <Typography
              inline
              className={classes.username}
              component='a'
              href={'/' + this.props.owner.username}>
              @{this.props.owner.username}
            </Typography>
          </SheetContent>}
          {/* content */}
          <SheetContent>
            <Typography
              inline
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
          {/* reply */}
          {this.props.replyId &&
          <SheetContent className={classes.reply}>
            <Sheet background>
              <SheetContent>
                <Typography
                  className={classes.content}
                  dangerouslySetInnerHTML={{__html: this.props.reply.content}} />
              </SheetContent>
            </Sheet>
          </SheetContent>}
          {/* reaction */}
          {this.props.reactions.slice()[0] &&
          <SheetActions>
            <div className={classes.reactionList}>
              {this.props.reactions.map(({name, ownerIds}) =>
                <ChipPostReaction
                  key={name}
                  name={name}
                  userId={this.props.userId}
                  ownerIds={ownerIds}
                  postId={this.props._id}
                  onUpdateReaction={() => this.onUpdateReaction(this.props._id, name)} />
              )}
            </div>
          </SheetActions>}
        </Sheet>
        {/* reaction */}
        {this.state.isOpenActions &&
        <PostReaction
          isLogged={this.props.isLogged}
          isOwner={this.props.isLogged === this.props.ownerId}
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
        <Sheet dense background>
          <SheetActions>
            <Typography type='subheading'>{data.title}</Typography>
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
    if (this.props.router.location.pathname.includes('thread')) {
      this.props.updatePostReaction(postId, {name})
      .then(() => {
        this.setState({isInputReaction: false, inputNewReaction: ''})
      })
      .catch(err => { this.props.snackbar.setError(err) })
      return
    }
    this.props.updatePostReaction(postId, {name})
    .then(() => {
      this.setState({isOpenActions: false, isInputReaction: false, inputNewReaction: ''})
    })
    .catch(err => { this.props.snackbar.setError(err) })
  }

  componentWillMount () {
    this.forceUpdater = setInterval(() => {
      this.forceUpdate()
    }, 5000)
  }

  componentWillUnmount () {
    if (this.forceUpdater) {
      clearInterval(this.forceUpdater)
    }
  }
}

export default compose(
  withStyles(styles),
  inject(stores => ({snackbar: stores.snackbar})),
  withCurrentUser,
  withRouter,
  withMethod('updatePostReaction'),
  withMethod('removePost')
)(Post)
