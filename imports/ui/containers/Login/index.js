import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { isAlpha, isEmail } from 'validator'
import LightbulbOutlineIcon from 'material-ui-icons/LightbulbOutline'
import WhatshotIcon from 'material-ui-icons/Whatshot'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import TextFiled from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Layout from '/imports/ui/components/UI-Layout'
import Sheet from '/imports/ui/components/UI-Sheet'
import SheetContent from '/imports/ui/components/UI-SheetContent'
import SheetActions from '/imports/ui/components/UI-SheetActions'
import Block from '/imports/ui/components/UI-Block'
import InlineTypography from '/imports/ui/components/UI-InlineTypography'
import styles from './index.style'

@withStyles(styles)
@inject('accounts')
@observer
export default class Login extends Component {
  render () {
    const {classes} = this.props
    return (
      <Layout>
        <Sheet>
          <Block align='center'>
            <img className={classes.appLogoImage} src='/images/logo.png' />
            <Typography className={classes.appVersion} align='center'>{Meteor.settings.public.version}</Typography>
          </Block>
        </Sheet>
        <Sheet key='login'>
          <Block width={400} align='center'>
            <SheetActions>
              <TextFiled fullWidth
                name='username'
                label={this.state.error === 'username' ? this.state.errorMessage : 'username'}
                onChange={this.onInputUsername}
                onKeyDown={this.onPressEnter}
                value={this.state.username}
                error={this.state.error === 'username'}
                maxLength='40' />
            </SheetActions>
            <SheetActions>
              <TextFiled fullWidth
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
              <LightbulbOutlineIcon {...this.iconStyle} />
              <InlineTypography className={classes.AppPointTitle}>シンプル</InlineTypography>
            </SheetContent>
            <SheetContent>
              <Typography>
                Swはとてもシンプルな完全匿名のチャットです。<br />
                ログインしてもユーザ名を伏せて書き込みできます。
              </Typography>
            </SheetContent>
          </Block>
        </Sheet>
        <Sheet>
          <Block width={500} align='center'>
            <SheetContent>
              <WhatshotIcon {...this.iconStyle} />
              <InlineTypography className={classes.AppPointTitle}>オープンソース</InlineTypography>
            </SheetContent>
            <SheetContent>
              <Typography>
                Meteor・Reactで開発しているオープンソースのプロジェクトです。<br />
              </Typography>
            </SheetContent>
          </Block>
        </Sheet>
        <Sheet>
          <SheetContent>
            <Typography
              component='a'
              type='display1'
              target='new'
              href='https://github.com/uu-fish/swimmy.io'
              align='center'>
              GitHub
            </Typography>
          </SheetContent>
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
    this.props.accounts.insert({
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
