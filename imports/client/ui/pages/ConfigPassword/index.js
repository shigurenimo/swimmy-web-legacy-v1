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
import withCurrentUser from '/imports/client/ui/hocs/withCurrentUser'
import withScrollTop from '/imports/client/ui/hocs/withScrollTop'
import styles from './index.style'
import withMethod from '../../hocs/withMethod'

class Admin extends Component {
  render () {
    if (this.props.isLoggingIn) return <div>loading...</div>
    return (
      <Layout>
        <Grid container>
          <Grid item xs={12}>
            <Typography type='display1'>パスワードの更新</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              パスワードはログインに使用します。<br />
              忘れないように保管してください。
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={this.state.currentPassword}
              type='password'
              label='新しいパスワード'
              maxLength={20}
              helperText='4文字以上20以内'
              onChange={this.onInputCurrentPassword} />
          </Grid>
          <Grid item xs={12}>
            <TextField
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
      this.props.snackbar.show(res.message)
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