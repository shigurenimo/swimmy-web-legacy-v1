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
import styles from './index.style'
import withMethod from '../../hocs/withMethod'

class Admin extends Component {
  render () {
    const {classes, currentUser} = this.props
    if (this.props.isLoggingIn) { return <NowLoading /> }
    return (
      <Layout>
        <Grid container>
          <Grid item xs={12}>
            <Typography type='display1'>ユーザネームの更新</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              ユーザネームはログインに使用します。<br />
              人が不愉快に思うようなユーザネームは使用しないでください。
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              className={this.props.classes.textField}
              value={this.state.username}
              label={currentUser.username}
              maxLength={10}
              error={!!this.state.error}
              placeholder='ユーザネーム'
              helperText={this.state.error || '最大20文字'}
              onChange={this.onInputUsername} />
          </Grid>
          {this.state.username &&
          <Grid item xs={12}>
            <Typography>
              以下のように変更されます。
            </Typography>
            <Typography>
              {currentUser.username} > {this.state.username}
            </Typography>
          </Grid>}
          <Grid item xs={12}>
            <Button raised color='primary' onClick={this.onSubmit}>更新</Button>
          </Grid>
        </Grid>
      </Layout>
    )
  }

  state = {
    username: '',
    error: ''
  }

  onInputUsername = (event) => {
    event.persist()
    this.setState({username: event.target.value, error: ''})
  }

  onSubmit = () => {
    const {username} = this.state
    if (!username) return
    this.props.updateUserUsername(username)
    .then(res => {
      this.setState({username: ''})
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
  withMethod('updateUserUsername'),
  withScrollTop
)(Admin)