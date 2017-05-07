import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import IconClear from 'material-ui/svg-icons/content/clear'

@inject('snackbar', 'user')
@observer
class ConfigAccount extends Component {
  render () {
    return <div className='container:admin-config'>
      {/* ディスプレイネーム */}
      <div className='block:username'>
        <div className='text:username-title'>
          ハンドルネーム
        </div>
        <input className='input:username'
          type='text'
          value={this.state.name}
          placeholder='ハンドルネーム'
          maxLength='20'
          onChange={this.onInputName.bind(this)}
          onBlur={this.onCheckName.bind(this)}/>
        <div className='text:input-description'>
          本名など個人情報を含む名前は絶対に設定しないでください
        </div>
        {this.state.nameError &&
        <div className='text:input-error'>
          {this.state.nameError}
        </div>}
        <input className='input:submit-username'
          type='button'
          value='変更する'
          onTouchTap={this.onSubmitName.bind(this)}/>
      </div>
      {/* ユーザネーム */}
      <div className='block:username'>
        <div className='text:username-title'>
          ユーザネーム（ユーザID）
        </div>
        <input className='input:username'
          type='text'
          value={this.state.username}
          placeholder='ユーザネーム'
          maxLength='10'
          onChange={this.onInputUsername.bind(this)}
          onBlur={this.onCheckUsername.bind(this)}/>
        <div className='text:input-description'>
          ログイン時に使用します
        </div>
        {this.state.usernameError &&
        <div className='text:input-error'>
          {this.state.usernameError}
        </div>}
        <input className='input:submit-username'
          type='button'
          value='変更する'
          onTouchTap={this.onSubmitUsername.bind(this)}/>
      </div>
      {/* 地域 */}
      {/*
       <div className='block:region'>
        <div className='text:region-title'>
          チャンネル
        </div>
        <select className='input:select'
          value={this.props.user.info.profile.channel}
          onChange={this.onInputChannel.bind(this)}>
          {utils.regions.list.map(item =>
            <option key={item.value} value={item.value}>
              {item.name.jp}
            </option>)}
        </select>
      </div>
      */}
      {/* メールアドレス */}
      <div className='block:email'>
        <div className='text:input-title'>
          メールアドレス
        </div>
        {this.props.user.info.emails && this.props.user.info.emails[0] ? <div className='block:email-list'>
          {this.props.user.info.emails.map(email =>
            <div className='block:exist-email' key={email.address}>
              <div className='text:email'>
                {email.address}
              </div>
              <div
                className='input:remove-email'
                onTouchTap={this.onRemoveEmail.bind(this, email.address)}>
                <IconClear style={{width: 30, height: 30}} color='tomato'/>
              </div>
            </div>)}
        </div> : <div className='text:not-email'>登録されていません</div>}
        <div className='block:new-email'>
          <input
            className='input:new-email'
            type='text'
            value={this.state.inputNewEmail}
            onChange={this.onInputNewEmail.bind(this)}
            placeholder='追加するメールアドレス'/>
          <input
            className='input:submit-new-email'
            type='button'
            value='追加する'
            onTouchTap={this.onSubmitNewEmail.bind(this)}/>
          {this.state.inputNewEmailError &&
          <div className='text:error-email'>{this.state.inputNewEmailError}</div>}
        </div>
      </div>
      {/* パスワード */}
      <div className='block:password'>
        <div className='text:password-name'>
          パスワード変更
        </div>
        <input className='input:password'
          type='text'
          value={this.state.oldPassword}
          placeholder='現在のパスワード'
          onChange={this.onInputOldPassword.bind(this)}/>
        <input className='input:password'
          type='text'
          value={this.state.newPassword}
          placeholder='新しいパスワード'
          onChange={this.onInputNewPassword.bind(this)}/>
        <input className='input:submit-password'
          type='button'
          value='変更する'
          onTouchTap={this.onSubmitPassword.bind(this)}/>
      </div>
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
      onScrollTop: React.PropTypes.any
    }
  }
}

export { ConfigAccount }
