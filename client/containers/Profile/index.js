import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetActions from '../../components/UI-SheetActions'
import SheetContent from '../../components/UI-SheetContent'
import Post from '../CardPost'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('posts', 'snackbar', 'accounts', 'usersProfile')
@observer
export default class Profile extends Component {
  render () {
    const {
      posts: {index},
      accounts,
      usersProfile: {one: user},
      classes
    } = this.props
    return (
      <Layout>
        {/* アイコン */}
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
                  }} />)}
            </div>
          )}
        </Sheet>
        {/* ネーム */}
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
        {this.props.account.isLogged &&
        user.username !== accounts.one.username &&
        <Sheet>
          <SheetActions align='center'>
            <Button onClick={this.onFollow}>
              {accounts.followsIds.includes(user._id) ? 'フォローを外す' : 'フォローする'}
            </Button>
          </SheetActions>
        </Sheet>}
        {/* 投稿 */}
        {index.map(item => <Post key={item._id} {...item} />)}
      </Layout>
    )
  }

  onFollow () {
    const {usersProfile} = this.props
    this.props.account.updateFollow(usersProfile.one._id)
    .then(() => {
      this.props.snackbar.show('フォローを更新しました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
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
