import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import TextField from 'material-ui/TextField'
import Block from '../components/ui-block'
import Layout from '../components/ui-layout'
import Sheet from '../components/ui-sheet'
import SheetActions from '../components/ui-sheet-actions'
import SheetContent from '../components/ui-sheet-content'
import Button from '../components/ui-button'

@inject('snackbar', 'users')
@observer
export default class ConfigAccount extends Component {
  render () {
    return (
      <Layout>
        <Block width={400}>
          {/* ディスプレイネーム */}
          <Sheet>
            <SheetActions align='right'>
              <TextField
                value={this.state.name}
                label='ユーザの表示名'
                maxLength={20}
                onChange={this.onInputName}
                onBlur={this.onCheckName} />
            </SheetActions>
            {this.state.nameError &&
            <SheetActions>
              <Typography>
                {this.state.nameError}
              </Typography>
            </SheetActions>}
            <SheetActions align='right'>
              <Button onClick={this.onSubmitName}>
                update
              </Button>
            </SheetActions>
          </Sheet>
          {/* ユーザネーム */}
          <Sheet>
            <SheetActions>
              <TextField
                value={this.state.username}
                label='ユーザネーム'
                helperText='ログイン時に使用します'
                maxLength={10}
                onChange={this.onInputUsername}
                onBlur={this.onCheckUsername} />
            </SheetActions>
            {this.state.usernameError &&
            <SheetContent>
              <Typography>
                {this.state.usernameError}
              </Typography>
            </SheetContent>}
            <SheetActions align='right'>
              <Button onClick={this.onSubmitUsername}>
                update
              </Button>
            </SheetActions>
          </Sheet>
          {/* パスワード */}
          <Sheet>
            <SheetActions>
              <TextField
                value={this.state.oldPassword}
                label='現在のパスワード'
                onChange={this.onInputOldPassword} />
            </SheetActions>
            <SheetActions>
              <TextField
                value={this.state.newPassword}
                label='新しいパスワード'
                onChange={this.onInputNewPassword} />
            </SheetActions>
            <SheetActions align='right'>
              <Button onClick={this.onSubmitPassword}>
                update
              </Button>
            </SheetActions>
          </Sheet>
        </Block>
      </Layout>
    )
  }

  state = {
    name: this.props.users.one.profile.name,
    nameError: '',
    username: this.props.users.one.username,
    usernameError: '',
    inputNewEmail: '',
    inputNewEmailError: '',
    oldPassword: '',
    newPassword: ''
  }

  process = false

  // ハンドルネームを入力する
  onInputName (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 20) return
    this.setState({name: value})
  }

  onInputName = ::this.onInputName

  // ディスプレイネームをチェックする
  onCheckName () {
    const name = this.state.name
    if (name === this.props.users.one.profile.name) {
      this.setState({nameError: ''})
      return
    }
    if (name.length === 0) {
      this.setState({name: this.props.users.one.profile.name, usernameError: ''})
    }
    if (name.length < 1) {
      this.setState({nameError: '！ ちょっと短すぎます'})
      return
    }
    this.setState({nameError: ''})
  }

  onCheckName = ::this.onCheckName

  // ハンドルネームの更新を送信する
  onSubmitName () {
    if (this.process) return
    this.process = true
    const name = this.state.name
    this.props.users.updateName(name)
    .then(() => {
      this.props.snackbar.show('ハンドルネームを変更しました')
      this.setState({nameError: ''})
      this.process = false
    })
    .catch(err => {
      this.props.snackbar.error(err)
      this.process = false
    })
  }

  onSubmitName = ::this.onSubmitName

  // ユーザネームを入力する
  onInputUsername (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 20) return
    this.setState({username: value})
  }

  onInputUsername = ::this.onInputUsername

  // ユーザネームをチェックする
  onCheckUsername () {
    const username = this.state.username
    if (username === this.props.users.one.username) {
      this.setState({usernameError: ''})
      return
    }
    if (username.length === 0) {
      this.setState({username: this.props.users.one.username, usernameError: ''})
      return
    }
    if (username.length < 2) {
      this.setState({usernameError: '！ ちょっと短すぎます'})
      return
    }
    if (username.length > 0 && username.match(new RegExp('[^A-Za-z0-9]+'))) {
      this.setState({usernameError: '！ ユーザネームは英数字のみです'})
      return
    }
    if (Meteor.settings.public.reservedWord.includes(username)) {
      this.setState({usernameError: 'そのワードは予約されています'})
      return
    }
    this.props.users.checkExistUsername(username)
    .then(res => {
      if (res) {
        this.setState({usernameError: 'そのユーザネームは既に存在します'})
      } else {
        this.setState({usernameError: ''})
      }
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  onCheckUsername = ::this.onCheckUsername

  // ユーザネームの更新を送信する
  async onSubmitUsername () {
    if (this.process) return
    this.process = true
    const username = this.state.username
    await this.props.users.updateUsername(username)
    .then(res => {
      this.props.snackbar.show('ユーザネームを変更しました')
      this.setState({usernameError: '', username: username})
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
    this.process = false
  }

  onSubmitUsername = ::this.onSubmitUsername

  // チャンネルを更新する
  onInputChannel (event) {
    event.persist()
    const value = event.target.value
    this.props.users.updateChannel(value)
  }

  onInputChannel = ::this.onInputChannel

  // 現在のパスワードを更新する
  onInputOldPassword (event) {
    event.persist()
    const value = event.target.value
    this.setState({oldPassword: value})
  }

  onInputOldPassword = ::this.onInputOldPassword

  // 新しいパスワードの更新する
  onInputNewPassword (event) {
    event.persist()
    const value = event.target.value
    this.setState({newPassword: value})
  }

  onInputNewPassword = ::this.onInputNewPassword

  // パスワードの更新を送信する
  onSubmitPassword () {
    const oldPassword = this.state.oldPassword
    const newPassword = this.state.newPassword
    if (newPassword.length < 4) {
      this.props.snackbar.show('パスワードが短すぎます')
      return
    }
    this.props.users.updatePassword(oldPassword, newPassword)
    .then(() => {
      this.setState({oldPassword: '', newPassword: ''})
      this.props.snackbar.show('パスワードを変更しました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  onSubmitPassword = ::this.onSubmitPassword

  // メールアドレスを削除する
  onRemoveEmail (email) {
    const confirm = window.confirm('削除してもいいですか？')
    if (!confirm) return
    this.props.users.updatePullEmail(email)
    .then(() => {
      this.props.snackbar.show('メールアドレスを削除しました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  onRemoveEmail = ::this.onRemoveEmail

  // 新しいメールアドレスを入力する
  onInputNewEmail (event) {
    event.persist()
    const value = event.target.value
    this.setState({inputNewEmail: value})
  }

  onInputNewEmail = ::this.onInputNewEmail

  // 新しいメールアドレスを追加する
  async onSubmitNewEmail () {
    if (this.process) return
    this.process = true
    const newEmail = this.state.inputNewEmail
    await this.props.users.updatePushEmail(newEmail)
    .then(() => {
      this.props.snackbar.show('メールアドレスを追加しました')
      this.setState({inputNewEmail: '', inputNewEmailError: ''})
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
    this.process = false
  }

  onSubmitNewEmail = ::this.onSubmitNewEmail

  componentDidMount () {
    this.context.onScrollTop()
  }

  static get contextTypes () {
    return {
      onScrollTop: propTypes.any
    }
  }
}
