import TextField from 'material-ui/TextField'
import { inject, observer } from 'mobx-react'
import withStyles from 'material-ui/styles/withStyles'
import compose from 'ramda/src/compose'
import React, { Component } from 'react'

import Button from '/imports/client/ui/components/Button'
import Sheet from '/imports/client/ui/components/Sheet'
import withMethod from '/imports/client/ui/hocs/withMethod'
import withRouter from '/imports/client/ui/hocs/withRouter'
import FlexGrow from '/imports/client/ui/components/FlexGrow'

import styles from './Actions.style'

class PostReaction extends Component {
  render () {
    return (
      <Sheet>
        {(this.props.isOwner || !this.props.isThread) &&
        <div className={this.props.classes.threadAction}>
          <FlexGrow />
          {this.props.isOwner &&
          <Button dense color='accent' onClick={this.onRemovePost}>削除する</Button>}
          {!this.props.isThread &&
          <Button dense raised color='primary' onClick={this.onOpenThread}>スレッドを開く</Button>}
        </div>}
        {this.props.isLogged &&
        <div className={this.props.classes.inputAction}>
          <TextField
            fullWidth
            value={this.state.inputNewReaction}
            label='新しいラベル'
            InputProps={{placeholder: this.reactionPlaceholder}}
            maxLength='10'
            onChange={this.onInputNewReaction} />
        </div>}
        {this.props.isLogged &&
        <div className={this.props.classes.submitAction}>
          <FlexGrow />
          <Button dense onClick={this.onSubmitNewReactionLike}>スキ</Button>
          <Button dense onClick={this.onSubmitNewReaction}>貼り付ける</Button>
        </div>}
      </Sheet>
    )
  }

  reactionPlaceholder = [
    'エモい', 'それな', 'いいね', 'わかる', 'わぁ',
    'オトナ', '既読', '高まる', 'おやすん'
  ][Math.floor(Math.random() * 9)]

  state = {
    isInputReaction: null,
    inputNewReaction: ''
  }

  get isNotThread () {
    return !this.props.router.location.pathname.includes('thread')
  }

  process = false

  // スレッドを開く
  onOpenThread = () => {
    if (this.props.replyPostId) {
      this.props.router.push('/thread/' + this.props.replyPostId)
    } else {
      this.props.router.push('/thread/' + this.props.postId)
    }
  }

  // 新しいリアクションを入力する
  onInputNewReaction = (event) => {
    event.persist()
    const value = event.target.value
    if (value.length > 20) return
    this.setState({inputNewReaction: value})
  }

  // 新しいリアクションを送信する
  onSubmitNewReaction = () => {
    const postId = this.props.postId
    const inputNewReaction = this.state.inputNewReaction
    this.onUpdateReaction(postId, inputNewReaction)
  }

  onSubmitNewReactionLike = () => {
    const postId = this.props.postId
    this.onUpdateReaction(postId, 'スキ')
  }

  // リアクションを更新する
  onUpdateReaction = (postId, name) => {
    if (!this.props.isLogged) {
      this.props.snackbar.requireLogin()
      return
    }
    if (this.props.isThread) {
      this.props.updatePostReaction(postId, {name})
      .then(() => {
        this.setState({isInputReaction: false, inputNewReaction: ''})
      })
      .catch(this.props.snackbar.setError)
      return
    }
    this.props.updatePostReaction(postId, {name})
    .then(() => {
      this.setState({isInputReaction: false, inputNewReaction: ''})
    })
    .catch(this.props.snackbar.setError)
  }

  // 投稿を削除する
  onRemovePost = () => {
    const confirm = window.confirm('削除してもいいですか？')
    if (!confirm) return
    this.props.removePost({_id: this.props.postId})
    .catch(this.props.snackbar.setError)
  }
}

export default compose(
  withStyles(styles),
  withRouter,
  withMethod('updatePostReaction'),
  withMethod('removePost'),
  inject(store => ({snackbar: store.snackbar})),
  observer
)(PostReaction)
