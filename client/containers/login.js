import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { isAlpha, isEmail } from 'validator'
import IconNotInterested from 'material-ui-icons/NotInterested'
import IconWhatshot from 'material-ui-icons/Whatshot'
import IconGesture from 'material-ui-icons/Gesture'

@inject('user', 'snackbar')
@observer
class Login extends Component {
  render () {
    return <div className='container:login'>
      <div className='block:form-title' key='title'>
        <div className='block:app-title'>
          <div className='text:app-version'>{Meteor.settings.public.version}</div>
          <div className='text:app-name'>Swimmy</div>
          <div className='text:app-description'>- 完全匿名の小さな電子掲示板 -</div>
        </div>
      </div>
      {this.router()}
      <div className='block:form-description-list'>
        <div className='block:form-description'>
          <div className='text:title'>
            <IconNotInterested {...this.iconStyle}/>
            <div className='text:inline'>完全匿名</div>
          </div>
          <div className='text:description'>
            メールアドレスは要らない。完全匿名で利用できます。
          </div>
        </div>
        <div className='block:form-description'>
          <div className='text:title'>
            <IconWhatshot {...this.iconStyle}/>
            <div className='text:inline'>オープンソース</div>
          </div>
          <div className='text:description'>
            Meteor・Reactで開発しているオープンソースのプロジェクトです。<br/>
            <a href='https://github.com/uu-fish/swimmy.io' target='new'>GitHub</a>
            {' or '}
            <a href='https://bitbucket.org/swimmy-io/swimmy.io' target='new'>Bitbucket</a>
          </div>
        </div>
        <div className='block:form-description'>
          <div className='text:title'>
            <IconGesture {...this.iconStyle}/>
            <div className='text:inline'>React Native</div>
          </div>
          <div className='text:description'>
            iOS・Androidアプリを開発中。
            でもリリースにはちょっと時間がかかっている。
          </div>
        </div>
      </div>
    </div>
  }

  get iconStyle () {
    return {
      style: {
        width: 26,
        height: 26
      },
      color: Meteor.settings.public.color.primary
    }
  }

  state = {
    username: '',
    displayName: '',
    channel: 'tokyo',
    password: '',
    passwordRetype: '',
    submitError: null,
    error: null
  }
  process = false
  form = 'login'

  router () {
    switch (this.state.form) {
      case 'register':
        return this.registerForm()
      default:
        return this.loginForm()
    }
  }

  onSwitchForm (form) {
    this.setState({
      form: form,
      username: '',
      displayName: '',
      password: '',
      passwordRetype: '',
      error: null
    })
  }

  loginForm () {
    return <div className='block:form-login' key='login'>
      <input
        className='input:data'
        type='text'
        name='username'
        placeholder='ユーザネーム or メールアドレス'
        onChange={this.onInputUsername.bind(this)}
        onKeyDown={this.onPressEnter.bind(this)}
        value={this.state.username}
        maxLength='40'/>
      {/* パスワード */}
      <input
        className='input:data'
        type='password'
        name='password'
        placeholder='パスワード'
        onChange={this.onInputPassword.bind(this)}
        onKeyDown={this.onPressEnter.bind(this)}
        value={this.state.password}
        maxLength='20'/>
      {/* ログイン */}
      <input
        className='input:next'
        type='button'
        value='ログイン'
        onTouchTap={this.onLogin.bind(this, null)}/>
      {/* エラー */}
      <div className='text:error'>
        {this.state.error}
      </div>
      {/* 新規登録 */}
      <div className='block:login-or-register'>
        <div className='text:or-login'>または</div>
        <input
          className='input:register'
          value='新規ユーザ'
          type='submit'
          onTouchTap={this.onSwitchForm.bind(this, 'register')}/>
      </div>
    </div>
  }

  registerForm () {
    return <div className='block:form-register' key='register'>
      {/* キャンセル */}
      <input
        className='input:cancel'
        type='button'
        value='取り消し'
        onTouchTap={this.onSwitchForm.bind(this, null)}/>
      {/* ユーザネーム */}
      <input
        className='input:data'
        type='text'
        name='username'
        placeholder='ユーザID（英数字）'
        onChange={this.onInputUsername.bind(this)}
        onKeyDown={this.onPressEnter.bind(this)}
        value={this.state.username}
        maxLength='20'/>
      {/* パスワード */}
      <input
        className='input:data'
        type='password'
        name='password'
        placeholder='パスワード'
        onChange={this.onInputPassword.bind(this)}
        onKeyDown={this.onPressEnter.bind(this)}
        value={this.state.password}
        maxLength='20'/>
      {/* パスワード 再入力 */}
      <input
        className='input:data'
        type='password'
        name='password'
        placeholder='パスワード:再入力'
        onChange={this.onInputPasswordRetype.bind(this)}
        onKeyDown={this.onPressEnter.bind(this)}
        value={this.state.passwordRetype}
        maxLength='20'/>
      {/* 登録 */}
      <input
        className='input:next'
        type='button'
        value='参加する'
        onTouchTap={this.onRegister.bind(this, null)}/>
      {/* エラー */}
      <div className='text:error'>
        {this.state.error}
      </div>
    </div>
  }

  // ユーザネームを入力する
  onInputUsername (event) {
    event.preventDefault()
    event.persist()
    const value = event.target.value
    if (this.state.error) {
      this.setState({username: value, error: null})
    } else {
      this.setState({username: value})
    }
  }

  // ディスプレイネームを入力する
  onInputDisplayName (event) {
    event.preventDefault()
    event.persist()
    const value = event.target.value
    if (this.state.error) {
      this.setState({displayName: value, error: null})
    } else {
      this.setState({displayName: value})
    }
  }

  // リージョンを入力する
  onInputChannel (event) {
    event.persist()
    const value = event.target.value
    this.setState({channel: value})
  }

  // パスワードを入力する
  onInputPassword (event) {
    event.preventDefault()
    event.persist()
    const value = event.target.value
    if (this.state.error) {
      this.setState({password: value, error: null})
    } else {
      this.setState({password: value})
    }
  }

  // パスワードを再入力する
  onInputPasswordRetype (event) {
    event.preventDefault()
    event.persist()
    const value = event.target.value
    if (this.state.error) {
      this.setState({passwordRetype: value, error: null})
    } else {
      this.setState({passwordRetype: value})
    }
  }

  // ログインする
  async onLogin (event) {
    if (event) event.preventDefault()
    if (this.process) return
    this.process = true
    // ↓ ユーザネーム
    const username = this.state.username
    if (username.length === 0) {
      this.setState({error: 'ユーザネームを入力してください'})
      this.process = false
      return
    }
    const isNotUsername = username.indexOf('@') !== -1
    if (isNotUsername) {
      if (!isEmail(username)) {
        this.setState({error: 'メールアドレスの形式がちがいます'})
        this.process = false
        return
      }
    } else {
      if (username.match(new RegExp('[^A-Za-z0-9]+'))) {
        this.setState({error: 'ユーザネームは英数字のみです'})
        this.process = false
        return
      }
    }
    // ↓ パスワード
    const password = this.state.password
    if (password.length === 0) {
      this.setState({error: 'パスワードを入力してください'})
      this.process = false
      return
    }
    if (isAlpha(password)) {
      this.setState({error: 'パスワードは数字を含みます'})
      this.process = false
      return
    }
    Meteor.loginWithPassword(username, password, error => {
      if (error) {
        this.setState({error: 'ログインに失敗しました'})
      }
      this.process = false
    })
  }

  // 新規登録する
  async onRegister (event) {
    if (event) event.preventDefault()
    if (this.process) return
    this.process = true
    this.props.user.insert({
      username: this.state.username,
      password: this.state.password,
      passwordRetype: this.state.passwordRetype
    })
    .then(user => {
      Meteor.loginWithPassword(this.state.username, this.state.password)
    })
    .catch(err => {
      this.setState({error: err.reason})
      this.process = false
    })
  }

  // エンターキーを入力する
  onPressEnter (event) {
    const ENTER = 13
    if (event.which === ENTER) {
      event.preventDefault()
      if (this.state.form === 'register') {
        this.onRegister()
      } else {
        this.onLogin()
      }
    }
  }
}

export { Login }
