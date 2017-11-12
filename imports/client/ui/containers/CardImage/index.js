import classNames from 'classnames'
import Divider from 'material-ui/Divider'
import withStyles from 'material-ui/styles/withStyles'
import { inject } from 'mobx-react'
import compose from 'ramda/src/compose'
import React, { Component } from 'react'

import Button from '/imports/client/ui/components/Button'
import ChipPostReaction from '/imports/client/ui/components/ChipPostReaction'
import Image from '/imports/client/ui/components/Image'
import PostReaction from '/imports/client/ui/containers/CardPost/Actions'
import Sheet from '/imports/client/ui/components/Sheet'
import SheetActions from '/imports/client/ui/components/SheetActions'
import SheetContent from '/imports/client/ui/components/SheetContent'
import SheetImage from '/imports/client/ui/components/SheetImage'
import Typography from '/imports/client/ui/components/Typography'
import withRouter from '/imports/client/ui/hocs/withRouter'
import withCurrentUser from '/imports/client/ui/hocs/withCurrentUser'
import withMethod from '/imports/client/ui/hocs/withMethod'
import toSince from '/imports/utils/date/toSince'

import styles from '/imports/client/ui/containers/CardPost/index.style'

class CardImage extends Component {
  render () {
    const {classes} = this.props
    return (
      <div>
        <Sheet hover onClick={this.onOpenActions}>
          <div className={classes.textContent}>
            {/* username */}
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
          </div>
          {/* photo */}
          {this.props.imagePath &&
          <div className={classes.imageContent}>
            <div
              className={classNames(classes.photoImage, {
                [classes.photoImageOpen]: this.state.selectImage
              })}
              onClick={this.onSelectImage}>
              <Image src={this.props.imagePath + this.props.images.slice()[0].x256} />
            </div>
          </div>}
          {/* reaction */}
          {this.props.reactions.slice()[0] &&
          <div className={classes.tagAction}>
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
          </div>}
        </Sheet>
        {/* reaction */}
        {this.state.isOpenActions &&
        <PostReaction
          isLogged={this.props.isLogged}
          isOwner={this.props.userId === this.props.ownerId}
          postId={this.props._id}
          replyPostId={this.props.replyPostId} />}
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
      .catch(this.props.snackbar.setError)
      return
    }
    this.props.updatePostReaction(postId, {name})
    .then(() => {
      this.setState({isOpenActions: false, isInputReaction: false, inputNewReaction: ''})
    })
    .catch(this.props.snackbar.setError)
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
)(CardImage)
