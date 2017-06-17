import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { isAlpha, isEmail } from 'validator'
import IconNotInterested from 'material-ui-icons/NotInterested'
import IconWhatshot from 'material-ui-icons/Whatshot'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Textfiled from 'material-ui/TextField'
import Layout from '../components/ui-layout'
import Sheet from '../components/ui-sheet'
import SheetContent from '../components/ui-sheet-content'
import SheetActions from '../components/ui-sheet-actions'
import Block from '../components/ui-block'
import InlineTypography from '../components/ui-inline-typography'

@inject('users', 'snackbar')
@observer
export default class Login extends Component {
  render () {
    return (
      <Layout>
        <Sheet>
          <Block align='center'>
            <Typography align='center'>{Meteor.settings.public.version}</Typography>
            <Typography type='display1' align='center'>Swimmy</Typography>
          </Block>
        </Sheet>
        <Sheet key='login'>
          <Block width={400} align='center'>
            <SheetActions>
              <Textfiled
                name='username'
                label={this.state.error === 'username' ? this.state.errorMessage : 'username or email'}
                onChange={this.onInputUsername}
                onKeyDown={this.onPressEnter}
                value={this.state.username}
                error={this.state.error === 'username'}
                maxLength='40' />
            </SheetActions>
            <SheetActions>
              <Textfiled
                type='password'
                name='password'
                label={this.state.error === 'password' ? this.state.errorMessage : 'password'}
                onChange={this.onInputPassword}
                onKeyDown={this.onPressEnter}
                value={this.state.password}
                error={this.state.error === 'password'}
                maxLength='20' />
            </SheetActions>
            <SheetActions>
              <Typography align='right'>
                <Button onClick={this.onRegister}>
                  New
                </Button>
                <Button onClick={this.onLogin}>
                  Login
                </Button>
              </Typography>
            </SheetActions>
          </Block>
        </Sheet>
        <Sheet>
          <Block width={500} align='center'>
            <SheetContent>
              <IconNotInterested {...this.iconStyle} />
              <InlineTypography>完全匿名</InlineTypography>
            </SheetContent>
            <SheetContent>
              <Typography>
                メールアドレスは要らない。完全匿名で利用できます。
              </Typography>
            </SheetContent>
          </Block>
        </Sheet>
        <Sheet>
          <Block width={500} align='center'>
            <SheetContent>
              <IconWhatshot {...this.iconStyle} />
              <InlineTypography>オープンソース</InlineTypography>
            </SheetContent>
            <SheetContent>
              <Typography>
                Meteor・React・Material-UIで開発しているオープンソースのプロジェクトです。<br />
              </Typography>
              <Typography>
                <a href='https://github.com/uu-fish/swimmy.io' target='new'>GitHub</a>
                {' or '}
                <a href='https://bitbucket.org/swimmy-io/swimmy.io' target='new'>Bitbucket</a>
              </Typography>
            </SheetContent>
          </Block>
        </Sheet>
      </Layout>
    )
  }

  get iconStyle () {
    return {
      style: {
        width: '35px',
        height: '35px',
        paddingRight: '10px'
      },
      color: Meteor.settings.public.color.primary
    }
  }

  state = {
    username: '',
    displayName: '',
    channel: 'tokyo',
    password: '',
    error: null,
    errorMessage: ''
  }

  process = false

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

  onInputUsername = ::this.onInputUsername

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

  onInputPassword = ::this.onInputPassword

  // ログインする
  onLogin (event) {
    if (event) event.preventDefault()
    if (this.process) return
    this.process = true
    const username = this.state.username
    if (username.length === 0) {
      this.setState({error: 'username', errorMessage: 'ユーザネームを入力してください'})
      this.process = false
      return
    }
    const isNotUsername = username.indexOf('@') !== -1
    if (isNotUsername) {
      if (!isEmail(username)) {
        this.setState({error: 'email', errorMessage: 'メールアドレスの形式がちがいます'})
        this.process = false
        return
      }
    } else {
      if (username.match(new RegExp('[^A-Za-z0-9]+'))) {
        this.setState({error: 'email', errorMessage: 'ユーザネームは英数字のみです'})
        this.process = false
        return
      }
    }
    const password = this.state.password
    if (password.length === 0) {
      this.setState({error: 'password', errorMessage: 'パスワードを入力してください'})
      this.process = false
      return
    }
    if (isAlpha(password)) {
      this.setState({error: 'password', errorMessage: 'パスワードは数字を含みます'})
      this.process = false
      return
    }
    Meteor.loginWithPassword(username, password, error => {
      if (error) {
        this.setState({error: 'password', errorMessage: 'ログインに失敗しました'})
      }
      this.process = false
    })
  }

  onLogin = ::this.onLogin

  // 新規登録する
  onRegister (event) {
    if (event) event.preventDefault()
    if (this.process) return
    this.process = true
    this.props.users.insert({
      username: this.state.username,
      password: this.state.password
    })
    .then(user => {
      Meteor.loginWithPassword(this.state.username, this.state.password)
    })
    .catch(err => {
      this.setState({error: err.error, errorMessage: err.reason})
      this.process = false
    })
  }

  onRegister = ::this.onRegister

  // エンターキーを入力する
  onPressEnter (event) {
    const ENTER = 13
    if (event.which === ENTER) {
      event.preventDefault()
      this.onLogin()
    }
  }

  onPressEnter = ::this.onPressEnter
}
