import { Meteor } from 'meteor/meteor'

import { inject } from 'mobx-react'
import withStyles from 'material-ui/styles/withStyles'
import Button from 'material-ui/Button'
import Grid from 'material-ui/Grid'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import compose from 'ramda/src/compose'
import React, { Component } from 'react'

import Layout from '/imports/client/ui/components/Layout'
import NowLoading from '/imports/client/ui/components/NowLoading'
import withCurrentUser from '/imports/client/ui/hocs/withCurrentUser'
import withScrollTop from '/imports/client/ui/hocs/withScrollTop'
import withMethod from '/imports/client/ui/hocs/withMethod'

import styles from './index.style'

class Admin extends Component {
  render () {
    if (this.props.isLoggingIn) { return <NowLoading /> }
    return (
      <Layout>
        <Grid container>
          <Grid item xs={12}>
            <Typography type='display1'>パスワードの更新</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography gutterBottom>
              パスワードはログインに使用します。<br />
              アカウントを保護する為に以下のことを守ってください。
            </Typography>
            <Typography>
              - パスワードは4文字より長い<br />
              - パスワードに誕生日やアカウント名を含まない
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={this.props.classes.textField}
              value={this.state.currentPassword}
              type='password'
              label='新しいパスワード'
              maxLength={20}
              helperText='5文字以上20以下'
              onChange={this.onInputCurrentPassword} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={this.props.classes.textField}
              value={this.state.password}
              type='password'
              label='新しいパスワード（確認）'
              maxLength={20}
              error={!!this.state.error}
              helperText={this.state.error}
              onChange={this.onInputPassword}/>
          </Grid>
          <Grid item xs={12}>
            <Button raised color='primary' onClick={this.onSubmitPassword}>更新</Button>
          </Grid>
        </Grid>
      </Layout>
    )
  }

  state = {
    currentPassword: '',
    password: '',
    error: ''
  }

  onInputCurrentPassword = (event) => {
    event.persist()
    this.setState({currentPassword: event.target.value, error: ''})
  }

  onInputPassword = (event) => {
    event.persist()
    this.setState({password: event.target.value, error: ''})
  }

  onSubmitPassword = () => {
    const {currentPassword, password} = this.state
    if (!currentPassword || !password) return
    this.setPassword(currentPassword, password)
    .then(res => {
      this.setState({currentPassword: '', password: ''})
      this.props.snackbar.setMessage(res)
    })
    .catch(err => {
      if (err.message) {
        this.setState({error: err.message})
      }
    })
  }
}

export default compose(
  withStyles(styles),
  inject('snackbar'),
  withCurrentUser,
  withMethod('setPassword'),
  withScrollTop
)(Admin)