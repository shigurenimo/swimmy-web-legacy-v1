import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Layout from '../components/ui-layout'
import Sheet from '../components/ui-sheet'
import SheetActions from '../components/ui-sheet-actions'
import SheetContent from '../components/ui-sheet-content'
import Post from '../containers/post'
import styleSheet from './profile.style'

@withStyles(styleSheet)
@inject('posts', 'snackbar', 'users', 'usersProfile')
@observer
export default class Profile extends Component {
  render () {
    const {
      posts: {index},
      users: {followsIds},
      usersProfile: {one: user},
      classes
    } = this.props
    return (
      <Layout>
        {/* アイコン */}
        <Sheet>
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
        </Sheet>
        {/* ネーム */}
        <Sheet>
          <SheetContent>
            <Typography align='center'>
              {user.username}
            </Typography>
          </SheetContent>
          <SheetContent>
            <Typography type='title' align='center'>
              {user.profile.name}
            </Typography>
          </SheetContent>
        </Sheet>
        {this.props.users.isLogged &&
        user.username !== this.props.users.one._username &&
        <Sheet>
          <SheetActions align='center'>
            <Button onClick={this.onFollow}>
              {followsIds.includes(user._id) ? 'フォローを外す' : 'フォローする'}
            </Button>
          </SheetActions>
        </Sheet>}
        {/* 投稿 */}
        {index.map(item => <Post key={item._id} {...item} />)}
      </Layout>
    )
  }

  onFollow () {
    this.props.users.updateFollow(this.user._id)
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
