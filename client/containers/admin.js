import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Layout from '../components/ui-layout'
import styleSheet from './admin.style'

@withStyles(styleSheet)
@inject('posts', 'user')
@observer
export default class Admin extends Component {
  render () {
    const {classes} = this.props
    return (
      <div className={classes.container}>
        {/* アイコン */}
        <Layout>
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
        </Layout>
        {/* ネーム */}
        <div className={classes.name}>
          <div className={classes.usernameText}>
            {this.user.username}
          </div>
          <div className={classes.nameText}>
            {this.user.profile.name}
          </div>
        </div>
        <div className={classes.followList}>
          {this.forFollows()}
        </div>
      </div>
    )
  }

  get user () {
    return this.props.user.info
  }

  forFollows () {
    const {classes} = this.props
    const index = this.props.user.follows
    if (index.length < 1) {
      return null
    }
    return index.map(user =>
      <a key={user._id} href={'/' + user.username}>
        <Layout hover>
          <div className={classes.followListName}>{user.name}</div>
          <div className={classes.followListUsername}>@{user.username}</div>
        </Layout>
      </a>
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
