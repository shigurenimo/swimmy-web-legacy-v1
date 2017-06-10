import { Meteor } from 'meteor/meteor'
import { FlowRouter } from 'meteor/kadira:flow-router'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import IconClear from 'material-ui-icons/Clear'
import Input from 'material-ui/Input'
import Typography from 'material-ui/Typography'
import Layout from '../components/ui-layout'
import Block from '../components/ui-block'
import InlineBlock from '../components/ui-inline-block'
import Button from '../components/ui-input-button'
import Sheet from '../components/ui-sheet'
import SheetActions from '../components/ui-sheet-actions'
import SheetContent from '../components/ui-sheet-content'
import SheetImage from '../components/ui-sheet-image'
import { utils } from '../../imports/utils'

@inject('artworks', 'user', 'snackbar')
@observer
export default class ArtworkDetail extends Component {
  render () {
    return (
      <Layout>
        <Sheet>
          {/* ユーザ */}
          {this.data.public &&
          <SheetContent>
            <Typography>{this.data.public.name}@{this.data.public.username}</Typography>
          </SheetContent>}
          {/* イメージ */}
          <SheetImage src={this.src} />
          <Block width={600}>
            {/* タイトル */}
            {this.state.isEdit &&
            <SheetContent>
              <Input
                placeholder='タイトル（任意）'
                value={this.state.inputTitle}
                maxLength='100'
                onChange={this.onInputTitle.bind(this)} />
            </SheetContent>}
            {/* ノート */}
            {!this.state.isEdit && this.state.inputNote &&
            <SheetContent>
              <Typography dangerouslySetInnerHTML={{__html: this.data.note}} />
            </SheetContent>}
            {this.state.isEdit &&
            <SheetContent>
              <Input multiline
                placeholder='タップしてノートを編集'
                onChange={this.onInputNote.bind(this)}
                rows={8}
                maxLength='1000'
                value={this.state.inputNote} />
            </SheetContent>}
            {/* 匿名 */}
            {this.state.isEdit &&
            <SheetActions>
              <InlineBlock>匿名</InlineBlock>
              <Button
                primary={!this.state.inputIsPublic}
                onClick={this.onChangePublic.bind(this, false)}>
                オン
              </Button>
              <Button
                primary={this.state.inputIsPublic}
                onClick={this.onChangePublic.bind(this, true)}>
                オフ
              </Button>
            </SheetActions>}
            {/* タイムラインの表示 */}
            {this.state.isEdit &&
            <SheetActions>
              <InlineBlock>過去の作品</InlineBlock>
              <Button
                primary={this.state.inputIsSecret}
                onClick={this.onChangeSecret.bind(this, true)}>
                オン
              </Button>
              <Button
                primary={!this.state.inputIsSecret}
                onClick={this.onChangeSecret.bind(this, false)}>
                オフ
              </Button>
            </SheetActions>}
            {this.state.inputIsSecret &&
            <SheetContent>
              <Typography>
                タイムラインに表示されなくなります
              </Typography>
            </SheetContent>}
            {/* 投稿の削除 */}
            {this.props.user.isLogged &&
            this.data.owner === this.props.user._id &&
            <SheetActions align='right'>
              {!this.state.isEdit &&
              <Button onClick={this.onRemove.bind(this)}>
                投稿を削除する
              </Button>}
              {!this.state.isEdit &&
              <Button onClick={this.onChangeEdit.bind(this)}>
                内容を編集する
              </Button>}
              {this.state.isEdit &&
              <Button onClick={this.onChangeEdit.bind(this)}>
                編集を完了する
              </Button>}
            </SheetActions>}
            {/* リアクションボタン */}
            {!this.state.isEdit &&
            <SheetContent>
              {Object.keys(this.data.reactions).map(name =>
                <Button background
                  key={name}
                  primary={!!this.props.user.isLogged && this.data.reactions[name].includes(this.props.user._id)}
                  onClick={this.onUpdateReaction.bind(this, this.data._id, name)}>
                  {name + (this.data.reactions[name].length > 0 ? ' ' + this.data.reactions[name].length : '')}
                </Button>
              )}
            </SheetContent>}
            {/* リアクションボタンの編集 */}
            {this.props.user.isLogged && !this.state.isEdit &&
            <SheetActions flex>
              <Input
                value={this.state.inputNewReaction}
                placeholder='reaction'
                maxLength='10'
                onChange={this.onInputNewReaction.bind(this)} />
            </SheetActions>}
            {/* リプライ */}
            {this.props.user.isLogged && !this.state.isEdit &&
            <SheetActions>
              <Input multiline
                value={this.state.inputReply}
                placeholder='タップしてコメントを入力'
                onChange={this.onInputReply.bind(this)} />
            </SheetActions>}
            {/* リプライの送信 */}
            {this.state.inputReply.length > 0 && !this.state.isEdit &&
            <SheetActions align='right'>
              <Button onClick={this.onSubmitReply.bind(this, this.data._id)}>
                匿名リプライ
              </Button>
              <Button onClick={this.onSubmitReply.bind(this, this.data._id)}>
                リプライ
              </Button>
            </SheetActions>}
          </Block>
        </Sheet>
        {/* リプライ メッセージ */}
        {this.data.replies.length > 0 && !this.state.isEdit &&
        <Sheet>
          <Block>
            {this.data.replies.map((reply, index) =>
              <div className='block:reply-item' key={index}>
                <div className='block:layout'>
                  {/* ユーザネーム */}
                  {reply.public &&
                  <a className='block:public-name' href={'/' + reply.public.username}>
                    <div className='text:public-name'>{reply.public.name}</div>
                    <div className='text:public-username'>@{reply.public.username}</div>
                  </a>}
                  {/* 内容 */}
                  <div className='text:reply-message'>
                    {reply.content}
                    <span className='text:date'> - {utils.date.since(reply.createdAt)}</span>
                  </div>
                  {/* 削除 */}
                  {this.props.user.isLogged && reply.owner === this.props.user._id &&
                  <div
                    className='input:remove-reply'
                    onTouchTap={this.onRemoveReply.bind(this, this.data._id, reply._id)}>
                    <IconClear style={{width: 30, height: 30}} color='tomato' />
                  </div>}
                  {/* リアクションボタン */}
                  <div className='block:reaction-list'>
                    {Object.keys(reply.reactions).map(name =>
                      <input
                        className={'input:reaction ' +
                        (!!this.props.user.isLogged && reply.reactions[name].includes(this.props.user._id))}
                        key={name}
                        onTouchTap={this.onUpdateReplyReaction.bind(this, this.data._id, reply._id, name)}
                        type='button'
                        value={name + (reply.reactions[name].length > 0 ? ' ' + reply.reactions[name].length : '')} />)}
                  </div>
                </div>
              </div>)}
          </Block>
        </Sheet>}
      </Layout>
    )
  }

  get data () {
    return this.props.artworks.one
  }

  get src () {
    return Meteor.settings.public.assets.work.root +
      this.data.type + '/' +
      this.data.imageDate + '/' +
      this.data.image.full
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
    inputIsPublic: !!this.data.public,
    inputIsSecret: this.data.secret,
    inputTitle: this.data.title || '',
    inputNote: this.data.note || '',
    inputColors: this.data.colors,
    inputNewReaction: ''
  }

  // 投稿を削除する
  onRemove () {
    const confirm = window.confirm('削除してもいいですか？')
    if (!confirm) return
    const postId = this.data._id
    this.props.artworks.remove(postId)
    .then(postId => {
      FlowRouter.go('/artwork')
      this.props.artworks.removeIndex(postId)
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  // 編集のモードを切り替える
  onChangeEdit () {
    if (this.state.isEdit) {
      const postId = this.data._id
      const next = {
        isPublic: !!this.state.inputIsPublic,
        isSecret: this.state.inputIsSecret,
        title: this.state.inputTitle,
        note: this.state.inputNote,
        colors: this.state.inputColors.slice()
      }
      const eq = {
        isPublic: next.isPublic !== !!this.data.public,
        isSecret: next.isSecret !== this.data.secret,
        title: next.title !== this.data.title,
        note: next.note !== this.data.note,
        colors: String(next.colors) !== String(this.data.colors.slice())
      }
      this.setState({isEdit: false})
      if (!(eq.isPublic || eq.isSecret || eq.title || eq.note || eq.colors)) return
      this.props.artworks.update(postId, next)
      .then(post => {
        this.props.artworks.updateOne(post)
        this.props.artworks.updateIndex(post._id, post)
        this.props.snackbar.show('更新しました')
      })
      .catch(err => {
        this.props.snackbar.error(err)
      })
    } else {
      this.setState({isEdit: true})
    }
  }

  // タイトルを入力する
  onInputTitle (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 100) return
    this.setState({inputTitle: value})
  }

  // ノートを入力する
  onInputNote (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 1000) return
    this.setState({inputNote: value})
  }

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
    if (!this.props.user.isLogged) {
      this.props.snackbar.requireLogin()
      return
    }
    this.props.artworks.updateReaction(postId, name)
    .then(post => {
      this.props.artworks.updateOne(post)
      this.props.artworks.updateIndex(post._id, post)
      this.setState({inputNewReaction: ''})
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  // 新しいリアクションを入力する
  onInputNewReaction (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 20) return
    this.setState({inputNewReaction: value})
  }

  // 新しいリアクションを送信する
  onSubmitNewReaction () {
    const postId = this.data._id
    const inputNewReaction = this.state.inputNewReaction
    this.onUpdateReaction(postId, inputNewReaction)
  }

  // リプライを入力する
  onInputReply (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 200) return
    this.setState({inputReply: value})
  }

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
      this.props.artworks.insertOneReply(reply)
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
      return this.props.artworks.removeOneReply(replyId)
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  // リアクションを更新する
  onUpdateReplyReaction (postId, replyId, name) {
    if (!this.props.user.isLogged) {
      this.props.snackbar.requireLogin()
      return
    }
    this.props.artworks.updateReplyReaction(postId, replyId, name)
    .then(post => {
      return this.props.artworks.fetchOneFromId(post._id)
    })
    .then(post => {
      this.props.artworks.updateOne(post)
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
