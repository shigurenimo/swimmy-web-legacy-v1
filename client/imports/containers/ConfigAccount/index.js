import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Button from '../../components/Button'
import Block from '../../components/UI-Block'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetActions from '../../components/UI-SheetActions'
import SheetContent from '../../components/UI-SheetContent'

@inject('snackbar', 'accounts') @observer
export default class ConfigAccount extends Component {
  render () {
    return (
      <Layout>
        <Block width={400}>
          {/* username */}
          <Sheet>
            <SheetActions>
              <TextField fullWidth
                value={this.state.username}
                label='ユーザネーム'
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
          {/* display name */}
          <Sheet>
            <SheetActions>
              <TextField fullWidth
                value={this.state.name}
                label='ユーザの表示名'
                helperText='プロフィールに表示されます'
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
          {/* password */}
          <Sheet>
            <SheetActions>
              <TextField fullWidth
                value={this.state.oldPassword}
                label='現在のパスワード'
                onChange={this.onInputOldPassword} />
            </SheetActions>
            <SheetActions>
              <TextField fullWidth
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
    name: this.props.accounts.one.profile.name,
    nameError: '',
    username: this.props.accounts.one.username,
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
    if (name === this.props.accounts.one.profile.name) {
      this.setState({nameError: ''})
      return
    }
    if (name.length === 0) {
      this.setState({name: this.props.accounts.one.profile.name, usernameError: ''})
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
    this.props.accounts.updateName(name)
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
    if (username === this.props.accounts.one.username) {
      this.setState({usernameError: ''})
      return
    }
    if (username.length === 0) {
      this.setState({username: this.props.accounts.one.username, usernameError: ''})
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
    this.props.accounts.checkExistUsername(username)
    .then(res => {
      if (res) {
        this.setState({usernameError: 'そのユーザネームは既に存在します'})
      } else {
        this.setState({usernameError: ''})
      }
    })
    .catch(err => this.props.snackbar.error(err.reason))
  }

  onCheckUsername = ::this.onCheckUsername

  // ユーザネームの更新を送信する
  async onSubmitUsername () {
    if (this.process) return
    this.process = true
    const username = this.state.username
    await this.props.accounts.updateUsername(username)
    .then(res => {
      this.props.snackbar.show('ユーザネームを変更しました')
      this.setState({usernameError: '', username: username})
    })
    .catch(err => this.props.snackbar.error(err.reason))
    this.process = false
  }

  onSubmitUsername = ::this.onSubmitUsername

  // チャンネルを更新する
  onInputChannel (event) {
    event.persist()
    const value = event.target.value
    this.props.accounts.updateChannel(value)
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
    this.props.accounts.updatePassword(oldPassword, newPassword)
    .then(() => {
      this.setState({oldPassword: '', newPassword: ''})
      this.props.snackbar.show('パスワードを変更しました')
    })
    .catch(err => this.props.snackbar.error(err.reason))
  }

  onSubmitPassword = ::this.onSubmitPassword

  // メールアドレスを削除する
  onRemoveEmail (email) {
    const confirm = window.confirm('削除してもいいですか？')
    if (!confirm) return
    this.props.accounts.updatePullEmail(email)
    .then(() => {
      this.props.snackbar.show('メールアドレスを削除しました')
    })
    .catch(err => this.props.snackbar.error(err.reason))
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
    await this.props.accounts.updatePushEmail(newEmail)
    .then(() => {
      this.props.snackbar.show('メールアドレスを追加しました')
      this.setState({inputNewEmail: '', inputNewEmailError: ''})
    })
    .catch(err => this.props.snackbar.error(err.reason))
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
