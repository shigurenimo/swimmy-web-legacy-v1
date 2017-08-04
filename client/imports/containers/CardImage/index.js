import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import Chip from 'material-ui/Chip'
import Image from '../../components/UI-Image'
import Sheet from '../../components/UI-Sheet'
import SheetActions from '../../components/UI-SheetActions'
import SheetContent from '../../components/UI-SheetContent'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('routes', 'accounts', 'posts', 'snackbar') @observer
export default class CardImage extends Component {
  render () {
    const {classes} = this.props
    return (
      <div>
        <Sheet>
          {/* photo */}
          {this.props.imagePath &&
          <SheetContent>
            <div
              className={classes.photoImage}
              onTouchTap={this.onOpenThread}>
              <Image src={this.props.imagePath + this.props.images.slice()[0].x256} />
            </div>
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
        </Sheet>
      </div>
    )
  }

  onOpenThread () {
    if (this.props.routes.page === 'thread') return
    if (this.props.replyId) {
      this.props.routes.go('/thread/' + this.props.replyId)
    } else {
      this.props.routes.go('/thread/' + this.props._id)
    }
  }

  onOpenThread = ::this.onOpenThread

  // リアクションを更新する
  onUpdateReaction (postId, name) {
    if (!this.props.accounts.isLogged) {
      this.props.snackbar.requireLogin()
      return
    }
    if (this.props.routes.page === 'thread') {
      this.props.posts.updateReaction(postId, name)
      .then(post => {
        this.setState({isInputReaction: false, inputNewReaction: ''})
      })
      .catch(err => {
        this.props.snackbar.error(err)
      })
      return
    }
    this.props.posts.updateReaction(postId, name)
    .then(post => {
      this.setState({isReply: false, isInputReaction: false, inputNewReaction: ''})
    })
  }
}