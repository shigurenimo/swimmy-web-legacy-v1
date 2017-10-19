import TextField from 'material-ui/TextField'
import { inject, observer } from 'mobx-react'
import compose from 'ramda/src/compose'
import React, { Component } from 'react'

import Button from '/imports/client/ui/components/Button'
import Sheet from '/imports/client/ui/components/Sheet'
import SheetActions from '/imports/client/ui/components/SheetActions'
import withMethod from '/imports/client/ui/hocs/withMethod'
import withRouter from '/imports/client/ui/hocs/withRouter'

import FlexGrow from './FlexGrow'

class PostReaction extends Component {
  render () {
    return (
      <Sheet>
        <SheetActions>
          <FlexGrow />
          <Button dense raised color='primary' onClick={this.onOpenThread}>スレッドを開く</Button>
        </SheetActions>
        {this.props.isLogged &&
        <SheetActions>
          <TextField
            fullWidth
            value={this.state.inputNewReaction}
            label='新しいラベル'
            InputProps={{placeholder: this.reactionPlaceholder}}
            maxLength='10'
            onChange={this.onInputNewReaction} />
        </SheetActions>}
        {this.props.isLogged &&
        <SheetActions>
          <FlexGrow />
          <Button dense onClick={this.onSubmitNewReactionLike}>スキ</Button>
          <Button dense onClick={this.onSubmitNewReaction}>貼り付ける</Button>
        </SheetActions>}
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
    if (this.props.replyId) {
      this.props.router.push('/thread/' + this.props.replyId)
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
      .catch(err => { this.props.snackbar.setError(err) })
      return
    }
    this.props.updatePostReaction(postId, {name})
    .then(() => {
      this.setState({isInputReaction: false, inputNewReaction: ''})
    })
    .catch(err => { this.props.snackbar.setError(err) })
  }

  // 投稿を削除する
  onRemovePost = () => {
    const confirm = window.confirm('削除してもいいですか？')
    if (!confirm) return
    this.props.removePost({_id: this.props.postId})
    .catch(err => this.props.snackbar.setError(err))
  }
}

export default compose(
  withRouter,
  withMethod('updatePostReaction'),
  withMethod('removePost'),
  inject(store => ({snackbar: store.snackbar})),
  observer
)(PostReaction)
