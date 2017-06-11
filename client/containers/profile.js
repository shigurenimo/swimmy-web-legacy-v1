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
@inject('posts', 'snackbar', 'user', 'userOther')
@observer
export default class Profile extends Component {
  render () {
    const {classes} = this.props
    return (
      <Layout>
        {/* アイコン */}
        <Sheet>
          <div className={classes.squares}>
            {this.user.profile.code.map((i, index) =>
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
              {this.user.username}
            </Typography>
          </SheetContent>
          <SheetContent>
            <Typography type='title' align='center'>
              {this.user.profile.name}
            </Typography>
          </SheetContent>
        </Sheet>
        {this.props.user.isLogged &&
        this.user.username !== this.props.user.username &&
        <Sheet>
          <SheetActions align='center'>
            <Button onClick={this.onFollow.bind(this, this.user.username)}>
              {this.followsIds.includes(this.user._id) ? 'フォローを外す' : 'フォローする'}
            </Button>
          </SheetActions>
        </Sheet>}
        {/* 投稿 */}
        {this.posts.map(item => <Post key={item._id} {...item} />)}
      </Layout>
    )
  }

  get user () {
    return this.props.userOther.one
  }

  get posts () {
    const isNotFound = this.props.posts.index === null
    if (isNotFound) return null
    return this.props.posts.index.slice()
  }

  get followsIds () {
    return this.props.user.followsIds.slice()
  }

  onFollow () {
    this.props.user.updateFollow(this.user._id)
    .then(() => {
      this.props.snackbar.show('フォローを更新しました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
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
