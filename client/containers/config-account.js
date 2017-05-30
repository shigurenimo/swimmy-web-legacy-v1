import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import IconClear from 'material-ui-icons/Clear'
import Block from '../components/ui-block'
import InputButton from '../components/ui-input-button'
import InputText from '../components/ui-input-text'
import styleSheet from './config-account.style'

@withStyles(styleSheet)
@inject('snackbar', 'user')
@observer
export default class ConfigAccount extends Component {
  render () {
    const {classes} = this.props
    return <div className={classes.container}>
      {/* ディスプレイネーム */}
      <Block>
        <div className={classes.usernameTitle}>
          ハンドルネーム
        </div>
        <InputText
          value={this.state.name}
          placeholder='ハンドルネーム'
          maxLength={20}
          onChange={this.onInputName.bind(this)}
          onBlur={this.onCheckName.bind(this)} />
        <div className={classes.textDescription}>
          本名など個人情報を含む名前は絶対に設定しないでください
        </div>
        {this.state.nameError &&
        <div className={classes.textError}>
          {this.state.nameError}
        </div>}
        <InputButton
          onClick={this.onSubmitName.bind(this)}>
          変更する
        </InputButton>
      </Block>
      {/* ユーザネーム */}
      <Block>
        <div className={classes.usernameTitle}>
          ユーザネーム（ユーザID）
        </div>
        <inputText
          value={this.state.username}
          placeholder='ユーザネーム'
          maxLength='10'
          onChange={this.onInputUsername.bind(this)}
          onBlur={this.onCheckUsername.bind(this)} />
        <div className={classes.textDescription}>
          ログイン時に使用します
        </div>
        {this.state.usernameError &&
        <div>
          {this.state.usernameError}
        </div>}
        <InputButton
          onClick={this.onSubmitUsername.bind(this)}>
          変更する
        </InputButton>
      </Block>
      {/* メールアドレス */}
      <Block>
        <div className={classes.textItemTitle}>
          メールアドレス
        </div>
        {this.props.user.info.emails && this.props.user.info.emails[0]
          ? <div>
            {this.props.user.info.emails.map(email =>
              <div className={classes.blockExistEmail} key={email.address}>
                <div>
                  {email.address}
                </div>
                <div
                  className={classes.inputRemoveEmail}
                  onTouchTap={this.onRemoveEmail.bind(this, email.address)}>
                  <IconClear style={{width: 30, height: 30}} color='tomato' />
                </div>
              </div>)}
          </div>
          : <div>登録されていません</div>}
        <div>
          <InputText
            value={this.state.inputNewEmail}
            onChange={this.onInputNewEmail.bind(this)}
            placeholder='追加するメールアドレス' />
          <InputButton
            onTouchTap={this.onSubmitNewEmail.bind(this)}>
            追加する
          </InputButton>
          {this.state.inputNewEmailError &&
          <div>{this.state.inputNewEmailError}</div>}
        </div>
      </Block>
      {/* パスワード */}
      <Block>
        <div className={classes.textItemTitle}>
          パスワード変更
        </div>
        <InputText
          value={this.state.oldPassword}
          placeholder='現在のパスワード'
          onChange={this.onInputOldPassword.bind(this)} />
        <InputText
          value={this.state.newPassword}
          placeholder='新しいパスワード'
          onChange={this.onInputNewPassword.bind(this)} />
        <InputButton
          onClick={this.onSubmitPassword.bind(this)}>
          変更する
        </InputButton>
      </Block>
    </div>
  }

  state = {
    name: this.props.user.info.profile.name,
    nameError: '',
    username: this.props.user.info.username,
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

  // ディスプレイネームをチェックする
  onCheckName () {
    const name = this.state.name
    if (name === this.props.user.info.profile.name) {
      this.setState({nameError: ''})
      return
    }
    if (name.length === 0) {
      this.setState({name: this.props.user.info.profile.name, usernameError: ''})
    }
    if (name.length < 1) {
      this.setState({nameError: '！ ちょっと短すぎます'})
      return
    }
    this.setState({nameError: ''})
  }

  // ハンドルネームの更新を送信する
  onSubmitName () {
    if (this.process) return
    this.process = true
    const name = this.state.name
    this.props.user.updateName(name)
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

  // ユーザネームを入力する
  onInputUsername (event) {
    event.persist()
    const value = event.target.value
    if (value.length > 20) return
    this.setState({username: value})
  }

  // ユーザネームをチェックする
  onCheckUsername () {
    const username = this.state.username
    if (username === this.props.user.info.username) {
      this.setState({usernameError: ''})
      return
    }
    if (username.length === 0) {
      this.setState({username: this.props.user.info.username, usernameError: ''})
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
    this.props.user.checkExistUsername(username)
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

  // ユーザネームの更新を送信する
  onSubmitUsername () {
    if (this.process) return
    this.process = true
    const username = this.state.username
    this.props.user.updateUsername(username)
    .then(res => {
      this.props.snackbar.show('ユーザネームを変更しました')
      this.setState({usernameError: '', username: username})
      this.process = false
    })
    .catch(err => {
      this.props.snackbar.error(err)
      this.process = false
    })
  }

  // チャンネルを更新する
  onInputChannel (event) {
    event.persist()
    const value = event.target.value
    this.props.user.updateChannel(value)
  }

  // 現在のパスワードを更新する
  onInputOldPassword (event) {
    event.persist()
    const value = event.target.value
    this.setState({oldPassword: value})
  }

  // 新しいパスワードの更新する
  onInputNewPassword (event) {
    event.persist()
    const value = event.target.value
    this.setState({newPassword: value})
  }

  // パスワードの更新を送信する
  onSubmitPassword () {
    const oldPassword = this.state.oldPassword
    const newPassword = this.state.newPassword
    if (newPassword.length < 4) {
      this.props.snackbar.show('パスワードが短すぎます')
      return
    }
    this.props.user.updatePassword(oldPassword, newPassword)
    .then(() => {
      this.setState({oldPassword: '', newPassword: ''})
      this.props.snackbar.show('パスワードを変更しました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  // メールアドレスを削除する
  onRemoveEmail (email) {
    const confirm = window.confirm('削除してもいいですか？')
    if (!confirm) return
    this.props.user.removeEmail(email)
    .then(() => {
      this.props.snackbar.show('メールアドレスを削除しました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }

  // 新しいメールアドレスを入力する
  onInputNewEmail (event) {
    event.persist()
    const value = event.target.value
    this.setState({inputNewEmail: value})
  }

  // 新しいメールアドレスを追加する
  async onSubmitNewEmail () {
    if (this.process) return
    this.process = true
    const newEmail = this.state.inputNewEmail
    this.props.user.addEmail(newEmail)
    .then(() => {
      this.props.snackbar.show('メールアドレスを追加しました')
      this.setState({inputNewEmail: '', inputNewEmailError: ''})
      this.process = false
    })
    .catch(err => {
      this.props.snackbar.error(err)
      this.process = false
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
