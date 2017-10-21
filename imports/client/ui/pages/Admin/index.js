import { Meteor } from 'meteor/meteor'

import withStyles from 'material-ui/styles/withStyles'
import Typography from 'material-ui/Typography'
import compose from 'ramda/src/compose'
import React, { Component } from 'react'

import Layout from '/imports/client/ui/components/Layout'
import Sheet from '/imports/client/ui/components/Sheet'
import SheetContent from '/imports/client/ui/components/SheetContent'
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
        {/* icon */}
        <Sheet>
          {(currentUser.config &&
            currentUser.config.twitter &&
            currentUser.config.twitter.useIcon) ? (
            <div className=''>
              <img
                className={classes.icon}
                src={currentUser.services.twitter.profile_image_url_https.replace('_normal', '')} />
            </div>
          ) : (
            <div className={classes.squares}>
              {currentUser.profile.code.split('').map((i, index) =>
                <div
                  className={classes.square}
                  key={index + '-' + i}
                  style={{
                    backgroundColor: i === '1'
                      ? Meteor.settings.public.color.primary
                      : i === '2' ? Meteor.settings.public.color.secondary : 'rgb(0 0 0)'
                  }} />)}
            </div>
          )}
        </Sheet>
        {/* name */}
        <Sheet>
          <SheetContent>
            <Typography align='center'>
              {currentUser.profile.name}
            </Typography>
          </SheetContent>
          <SheetContent>
            <Typography type='display1' align='center'>
              @{currentUser.username}
            </Typography>
          </SheetContent>
        </Sheet>
        {this.forFollows()}
      </Layout>
    )
  }

  forFollows () {
    const index = this.props.currentUser.profile.follows
    if (index.length < 1) { return null }
    return index.map(user =>
      <Sheet hover key={user._id} href={'/' + user.username}>
        <SheetContent>
          <Typography>{user.name}@{user.username}</Typography>
        </SheetContent>
      </Sheet>
    )
  }
}

export default compose(
  withStyles(styles),
  withCurrentUser,
  withScrollTop
)(Admin)