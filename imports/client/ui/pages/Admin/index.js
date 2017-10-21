import { Meteor } from 'meteor/meteor'

import { inject } from 'mobx-react'
import withStyles from 'material-ui/styles/withStyles'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import compose from 'ramda/src/compose'
import React, { Component } from 'react'

import CodeIcon from '/imports/client/ui/components/CodeIcon'
import Layout from '/imports/client/ui/components/Layout'
import NowLoading from '/imports/client/ui/components/NowLoading'
import withCurrentUser from '/imports/client/ui/hocs/withCurrentUser'
import withScrollTop from '/imports/client/ui/hocs/withScrollTop'
import withMethod from '/imports/client/ui/hocs/withMethod'

import styles from './index.style'

class Admin extends Component {
  render () {
    const {classes, currentUser} = this.props
    if (this.props.isLoggingIn) { return <NowLoading /> }
    return (
      <Layout>
        <Grid container>
          <Grid item xs={12}>
            <Typography type='display1'>アカウント</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              この機能は調整中です。
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <CodeIcon code={currentUser.profile.code.split('')} />
          </Grid>
        </Grid>
      </Layout>
    )
  }
}

export default compose(
  withStyles(styles),
  inject('snackbar'),
  withCurrentUser,
  withMethod('updateUserUsername'),
  withScrollTop
)(Admin)