import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetContent from '../../components/UI-SheetContent'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('accounts')
@observer
export default class Admin extends Component {
  render () {
    const {accounts: {one: account}, classes} = this.props
    return (
      <Layout>
        {/* icon */}
        <Sheet>
          {(account.config && account.config.twitter && account.config.twitter.useIcon) ? (
            <div className=''>
              <img
                className={classes.icon}
                src={account.services.twitter.profile_image_url_https.replace('_normal', '')} />
            </div>
          ) : (
            <div className={classes.squares}>
              {account.profile.code.map((i, index) =>
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
              {account.profile.name}
            </Typography>
          </SheetContent>
          <SheetContent>
            <Typography type='display1' align='center'>
              @{account.username}
            </Typography>
          </SheetContent>
        </Sheet>
        {this.forFollows()}
      </Layout>
    )
  }

  forFollows () {
    const index = this.props.accounts.one.profile.follows
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
