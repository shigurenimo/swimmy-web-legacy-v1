import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Layout from '/client/components/UI-Layout'
import Sheet from '/client/components/UI-Sheet'
import SheetActions from '/client/components/UI-SheetActions'
import SheetContent from '/client/components/UI-SheetContent'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('snackbar', 'accounts', 'users')
@observer
export default class Profile extends Component {
  render () {
    const {accounts, users: {one: user}, classes} = this.props
    return (
      <Layout>
        <Sheet>
          {user.profile.icon ? (
            <SheetContent>
              <img className={classes.icon} src={user.profile.icon} />
            </SheetContent>
          ) : (
            <div className={classes.squares}>
              {user.profile.code.map((i, index) =>
                <div
                  className={classes.square}
                  key={index + '-' + i}
                  style={{
                    backgroundColor: i === '1'
                      ? Meteor.settings.public.color.primary
                      : i === '2' ? Meteor.settings.public.color.secondary : 'rgb(0 0 0)'
                  }} />
              )}
            </div>
          )}
        </Sheet>
        {/* name */}
        <Sheet>
          <SheetContent>
            <Typography align='center'>
              {user.profile.name}
            </Typography>
          </SheetContent>
          <SheetContent>
            <Typography type='display1' align='center'>
              @{user.username}
            </Typography>
          </SheetContent>
        </Sheet>
        {accounts.isLogged &&
        user.username !== accounts.one.username &&
        <Sheet>
          <SheetActions align='center'>
            <Button onClick={this.onFollow}>
              {accounts.followsIds.includes(user._id) ? 'フォローを外す' : 'フォローする'}
            </Button>
          </SheetActions>
        </Sheet>}
      </Layout>
    )
  }

  onFollow () {
    this.props.account.updateFollow(this.props.users.one._id)
    .then(() => {
      this.props.snackbar.show('フォローを更新しました')
    })
    .catch(err => this.props.snackbar.error(err.reason))
  }

  onFollow = ::this.onFollow

  componentDidMount () {
    this.context.onScrollTop()
  }

  static get contextTypes () {
    return {
      onScrollTop: propTypes.any
    }
  }
}
