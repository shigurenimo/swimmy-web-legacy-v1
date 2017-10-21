import { Meteor } from 'meteor/meteor'

import withStyles from 'material-ui/styles/withStyles'
import Grid from 'material-ui/Grid'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import compose from 'ramda/src/compose'
import React, { Component } from 'react'

import Layout from '/imports/client/ui/components/Layout'
import withCurrentUser from '/imports/client/ui/hocs/withCurrentUser'
import withScrollTop from '/imports/client/ui/hocs/withScrollTop'
import styles from './index.style'

class Admin extends Component {
  render () {
    const {classes, currentUser} = this.props
    console.log(this.props)
    if (this.props.isLoggingIn) return <div>loading...</div>
    return (
      <Layout>
        <Grid container>
          <Grid item xs={12}>
            <Typography type='display1'>Account</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={this.state.username}
              label='ユーザネーム'
              maxLength={10}
              onChange={this.onInputUsername}
              onBlur={this.onCheckUsername} />
          </Grid>
        </Grid>
      </Layout>
    )
  }

  state = {
    name: '',
    nameError: '',
    username: '',
    usernameError: '',
    inputNewEmail: '',
    inputNewEmailError: '',
    oldPassword: '',
    newPassword: ''
  }

  onInputUsername = (event) => {
    event.persist()
    const value = event.target.value
    if (value.length > 20) return
    this.setState({username: value})
  }

  onCheckUsername = () => {
    const username = this.state.username
    this.props.checkExistUsername(username)
    .then(res => {
      if (res) {
        this.setState({usernameError: 'そのユーザネームは既に存在します'})
      } else {
        this.setState({usernameError: ''})
      }
    })
    .catch(err => this.props.snackbar.setError(err))
  }

  // ユーザネームの更新を送信する
  onSubmitUsername = () => {}
}

export default compose(
  withStyles(styles),
  withCurrentUser,
  withScrollTop
)(Admin)