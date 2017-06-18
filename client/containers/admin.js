import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Layout from '../components/ui-layout'
import Sheet from '../components/ui-sheet'
import SheetContent from '../components/ui-sheet-content'
import styleSheet from './admin.style'

@withStyles(styleSheet)
@inject('users')
@observer
export default class Admin extends Component {
  render () {
    const {
      users: {one: user},
      classes
    } = this.props
    return (
      <Layout>
        {/* icon */}
        <Sheet>
          {(user.config && user.config.twitter && user.config.twitter.useIcon) ? (
            <div className=''>
              <img
                className={classes.icon}
                src={user.services.twitter.profile_image_url_https.replace('_normal', '')} />
            </div>
          ) : (
            <div className={classes.squares}>
              {this.props.users.one.profile.code.map((i, index) =>
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
              {this.props.users.one.profile.name}
            </Typography>
          </SheetContent>
          <SheetContent>
            <Typography type='display1' align='center'>
              @{this.props.users.one.username}
            </Typography>
          </SheetContent>
        </Sheet>
        {this.forFollows()}
      </Layout>
    )
  }

  forFollows () {
    const index = this.props.users.one.profile.follows
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
