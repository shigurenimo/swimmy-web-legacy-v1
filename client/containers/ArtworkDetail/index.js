import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import utils from '/lib/utils'
import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import InlineTypography from '../../components/UI-InlineTypography'
import Layout from '../../components/UI-Layout'
import Block from '../../components/UI-Block'
import Button from '../../components/Button'
import Sheet from '../../components/UI-Sheet'
import SheetActions from '../../components/UI-SheetActions'
import SheetContent from '../../components/UI-SheetContent'
import SheetImage from '../../components/UI-SheetImage'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('artworks', 'accounts', 'router', 'snackbar') @observer
export default class ArtworkDetail extends Component {
  render () {
    const {classes} = this.props
    return (
      <Layout>
        <Sheet>
          {/* ユーザ */}
          {this.props.artworks.one.public &&
          <SheetContent>
            <Typography>
              {this.props.artworks.one.public.name}@{this.props.artworks.one.public.username}
            </Typography>
          </SheetContent>}
          {/* イメージ */}
          <SheetImage src={this.src} />
          <Block width={600}>
            {/* タイトル */}
            {this.state.isEdit &&
            <SheetContent>
              <TextField
                label='title'
                InputProps={{placeholder: 'My Artwork'}}
                value={this.state.inputTitle}
                maxLength='100'
                onChange={this.onTextFieldTitle} />
            </SheetContent>}
            {/* ノート */}
            {!this.state.isEdit && this.state.inputNote &&
            <SheetContent>
              <Typography dangerouslySetInnerHTML={{__html: this.props.artworks.one.note}} />
            </SheetContent>}
            {this.state.isEdit &&
            <SheetContent>
              <TextField multiline
                label='note'
                onChange={this.onTextFieldNote}
                maxLength='1000'
                value={this.state.inputNote} />
            </SheetContent>}
            {/* 匿名 */}
            {this.state.isEdit &&
            <SheetActions>
              <InlineTypography>匿名</InlineTypography>
              <Button
                selected={!this.state.inputIsPublic}
                onClick={this.onChangePublic.bind(this, false)}>
                on
              </Button>
              <Button
                selected={this.state.inputIsPublic}
                onClick={this.onChangePublic.bind(this, true)}>
                off
              </Button>
            </SheetActions>}
            {/* タイムラインの表示 */}
            {this.state.isEdit &&
            <SheetActions>
              <InlineTypography>過去の作品</InlineTypography>
              <Button
                selected={this.state.inputIsSecret}
                onClick={this.onChangeSecret.bind(this, true)}>
                on
              </Button>
              <Button
                selected={!this.state.inputIsSecret}
                onClick={this.onChangeSecret.bind(this, false)}>
                off
              </Button>
            </SheetActions>}
            {this.state.inputIsSecret &&
            <SheetContent>
              <Typography>
                タイムラインに表示されなくなります
              </Typography>
            </SheetContent>}
            {/* 投稿の削除 */}
            {this.props.accounts.isLogged &&
            this.props.artworks.one.owner === this.props.accounts.one._id &&
            <SheetActions align='right'>
              {!this.state.isEdit &&
              <Button onClick={this.onRemove}>
                remove
              </Button>}
              {!this.state.isEdit &&
              <Button onClick={this.onChangeEdit}>
                update
              </Button>}
              {this.state.isEdit &&
              <Button onClick={this.onChangeEdit}>
                finish
              </Button>}
            </SheetActions>}
            {/* リアクションボタン */}
            {!this.state.isEdit &&
            <SheetContent>
              {Object.keys(this.props.artworks.one.reactions).map(name =>
                <Button background
                  key={name}
                  selected={
                    !!this.props.accounts.isLogged &&
                    this.props.artworks.one.reactions[name].includes(this.props.accounts.one._id)
                  }
                  onClick={this.onUpdateReaction.bind(this, this.props.artworks.one._id, name)}>
                  {name + (this.props.artworks.one.reactions[name].length > 0 ? ' ' +
                    this.props.artworks.one.reactions[name].length : '')}
                </Button>
              )}
            </SheetContent>}
            {/* input reaction */}
            {this.props.accounts.isLogged && !this.state.isEdit &&
            <SheetActions>
              <TextField
                label='new reaction'
                InputProps={{placeholder: 'スキ'}}
                value={this.state.inputNewReaction}
                maxLength='10'
                onChange={this.onTextFieldNewReaction} />
            </SheetActions>}
            {this.props.accounts.isLogged &&
            this.state.inputNewReaction.length > 0 && !this.state.isEdit &&
            <SheetActions align='right'>
              <Button onClick={this.onSubmitNewReaction}>
                push
              </Button>
            </SheetActions>}
            {/* リプライ */}
            {this.props.accounts.isLogged && !this.state.isEdit &&
            <SheetActions>
              <TextField multiline
                label='new comment'
                value={this.state.inputReply}
                onChange={this.onTextFieldReply} />
            </SheetActions>}
            {/* リプライの送信 */}
            {this.state.inputReply.length > 0 && !this.state.isEdit &&
            <SheetActions align='right'>
              <Button onClick={this.onSubmitReply.bind(this, this.props.artworks.one._id)}>
                secret
              </Button>
              <Button onClick={this.onSubmitReply.bind(this, this.props.artworks.one._id)}>
                comment
              </Button>
            </SheetActions>}
          </Block>
        </Sheet>
        {/* reply */}
        {this.props.artworks.one.replies.length > 0 && !this.state.isEdit &&
        <Block>
          {this.props.artworks.one.replies.map((reply, index) =>
            <Sheet hover key={reply._id}>
              {/* username */}
              {reply.public &&
              <SheetContent>
                <Typography component='a' href={'/' + reply.public.username}>
                  {reply.public.name}@{reply.public.username}
                </Typography>
              </SheetContent>}
              {/* content */}
              <SheetContent>
                <Typography
                  className={classes.replyContent}
                  dangerouslySetInnerHTML={{__html: reply.content}} />
              </SheetContent>
              {/* createdAt */}
              <SheetContent>
                <Typography type='caption'> - {utils.date.since(reply.createdAt)}</Typography>
              </SheetContent>
              {/* add */}
              <SheetActions>
                {Object.keys(reply.reactions).map(name =>
                  <Button dense background
                    key={name}
                    selected={
                      !!this.props.accounts.isLogged &&
                      reply.reactions[name].includes(this.props.accounts.one._id)
                    }
                    onClick={this.onUpdateReplyReaction.bind(this, this.props.artworks.one._id, reply._id, name)}>
                    {name + (reply.reactions[name].length > 0 ? ' ' + reply.reactions[name].length : '')}
                  </Button>
                )}
              </SheetActions>
              {/* delete */}
              {this.props.accounts.isLogged && reply.owner === this.props.accounts.one._id &&
              <SheetActions align='right'>
                <Button onClick={this.onRemoveReply.bind(this, this.props.artworks.one._id, reply._id)}>
                  remove
                </Button>
              </SheetActions>}
            </Sheet>)}
        </Block>}
      </Layout>
    )
  }

  get src () {
    return this.props.artworks.one.imagePath + this.props.artworks.one.image.x1024
  }

  reactionPlaceholder = [
    'エモい', 'それな', 'いいね', 'わかる', 'わぁ',
    'オトナ', '既読', '高まる', 'おやすん'
  ][Math.floor(Math.random() * 9)]

  process = false

  state = {
    isEdit: false,
    isPublic: false,
    inputReply: '',
    inputIsPublic: !!this.props.artworks.one.public,
    inputIsSecret: this.props.artworks.one.secret,
    inputTitle: this.props.artworks.one.title || '',
    inputNote: this.props.artworks.one.note || '',
    inputColors: this.props.artworks.one.colors,
    inputNewReaction: ''
  }

  // 投稿を削除する
  onRemove () {
    const confirm = window.confirm('削除してもいいですか？')
    if (!confirm) return
    const postId = this.props.artworks.one._id
    this.props.artworks.remove(postId)
    .then(postId => {
      this.props.router.go('/artwork')
      this.props.artworks.pullIndex(postId)
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  onRemove = ::this.onRemove

  // 編集のモードを切り替える
  onChangeEdit () {
    if (this.state.isEdit) {
      const postId = this.props.artworks.one._id
      const next = {
        isPublic: !!this.state.inputIsPublic,
        isSecret: this.state.inputIsSecret,
        title: this.state.inputTitle,
        note: this.state.inputNote,
        colors: this.state.inputColors.slice()
      }
      const eq = {
        isPublic: next.isPublic !== !!this.props.artworks.one.public,
        isSecret: next.isSecret !== this.props.artworks.one.secret,
        title: next.title !== this.props.artworks.one.title,
        note: next.note !== this.props.artworks.one.note,
        colors: String(next.colors) !== String(this.props.artworks.one.colors.slice())
      }
      this.setState({isEdit: false})
      if (!(eq.isPublic || eq.isSecret || eq.title || eq.note || eq.colors)) return
      this.props.artworks.update(postId, next)
      .then(post => {
        this.props.artworks.replaceOne(post)
        this.props.artworks.replaceIndex(post._id, post)
        this.props.snackbar.show('更新しました')
      })
      .catch(err => {
        this.props.snackbar.error(err)
      })
    } else {
      this.setState({isEdit: true})
    }
  }

  onChangeEdit = ::this.onChangeEdit

  // タイトルを入力する
  onTextFieldTitle (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    this.setState({inputTitle: value})
  }

  onTextFieldTitle = ::this.onTextFieldTitle

  // ノートを入力する
  onTextFieldNote (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 1000) return
    this.setState({inputNote: value})
  }

  onTextFieldNote = ::this.onTextFieldNote

  // カラーを入力する
  onSelectColor (color, event) {
    event.preventDefault()
    const colors = this.state.inputColors
    if (colors.includes(color)) {
      const next = colors.filter(item => item !== color)
      this.setState({inputColors: next})
    } else {
      if (colors.length > 2) return
      const next = colors
      next.push(color)
      this.setState({inputColors: next})
    }
  }

  // 投稿の種類をパブリックに変更する
  onChangePublic (bool) {
    this.setState({inputIsPublic: bool})
  }

  // 公開・非公開を変更する
  onChangeSecret (bool) {
    this.setState({inputIsSecret: bool})
  }

  // リアクションを更新する
  onUpdateReaction (postId, name) {
    if (!this.props.accounts.isLogged) {
      this.props.snackbar.requireLogin()
      return
    }
    this.props.artworks.updateReaction(postId, name)
    .then(post => {
      this.props.artworks.replaceOne(post)
      this.props.artworks.replaceIndex(post._id, post)
      this.setState({inputNewReaction: ''})
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  // 新しいリアクションを入力する
  onTextFieldNewReaction (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 20) return
    this.setState({inputNewReaction: value})
  }

  onTextFieldNewReaction = ::this.onTextFieldNewReaction

  // 新しいリアクションを送信する
  onSubmitNewReaction () {
    const postId = this.props.artworks.one._id
    const inputNewReaction = this.state.inputNewReaction
    this.onUpdateReaction(postId, inputNewReaction)
  }

  onSubmitNewReaction = ::this.onSubmitNewReaction

  // リプライを入力する
  onTextFieldReply (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 200) return
    this.setState({inputReply: value})
  }

  onTextFieldReply = ::this.onTextFieldReply

  // 投稿の種類をパブリックに変更する
  onChangeReplyPublic (bool) {
    this.setState({isPublic: bool})
  }

  // リプライをサーバーに送信する
  onSubmitReply (postId) {
    const value = this.state.inputReply
    if (value.length > 200) return
    this.props.artworks.insertReply(postId, {
      isPublic: this.state.isPublic,
      content: value
    })
    .then(reply => {
      this.props.artworks.pushOneReply(reply)
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
    this.setState({inputReply: '', isReply: false})
  }

  // リプライを削除する
  onRemoveReply (postId, replyId) {
    const confirm = window.confirm('削除してもいいですか？')
    if (!confirm) return
    this.props.artworks.removeReply(postId, replyId)
    .then(() => {
      return this.props.artworks.pullOneReply(replyId)
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  // リアクションを更新する
  onUpdateReplyReaction (postId, replyId, name) {
    if (!this.props.accounts.isLogged) {
      this.props.snackbar.requireLogin()
      return
    }
    this.props.artworks.updateReplyReaction(postId, replyId, name)
    .then(post => {
      return this.props.artworks.findOneFromId(post._id)
    })
    .then(post => {
      this.props.artworks.replaceOne(post)
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  componentDidMount () {
    this.context.onScrollTop()
  }

  static get contextTypes () {
    return {
      onScrollTop: propTypes.any
    }
  }
}
