import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Layout from '/client/components/UI-Layout'
import Sheet from '/client/components/UI-Sheet'
import SheetContent from '/client/components/UI-SheetContent'
import styles from './index.style'

@withStyles(styles)
@inject('accounts')
@observer
export default class Admin extends Component {
  render () {
    const {accounts, classes} = this.props
    return (
      <Layout>
        {/* icon */}
        <Sheet>
          {(accounts.config && accounts.config.twitter && accounts.config.twitter.useIcon) ? (
            <div className=''>
              <img
                className={classes.icon}
                src={accounts.services.twitter.profile_image_url_https.replace('_normal', '')} />
            </div>
          ) : (
            <div className={classes.squares}>
              {accounts.profile.code.map((i, index) =>
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
              {accounts.profile.name}
            </Typography>
          </SheetContent>
          <SheetContent>
            <Typography type='display1' align='center'>
              @{accounts.username}
            </Typography>
          </SheetContent>
        </Sheet>
        {this.forFollows()}
      </Layout>
    )
  }

  forFollows () {
    const index = this.props.accounts.profile.follows
    if (index.length < 1) {
      return null
    }
    return index.map(user =>
      <Sheet hover key={user._id} href={'/' + user.username}>
        <SheetContent>
          <Typography>{user.name}@{user.username}</Typography>
        </SheetContent>
      </Sheet>
    )
  }

  componentDidMount () {
    this.context.onScrollTop()
  }

  static get contextTypes () {
    return {
      onScrollTop: propTypes.any
    }
  }
}
