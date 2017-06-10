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
@inject('posts', 'user')
@observer
export default class Admin extends Component {
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
        {this.forFollows()}
      </Layout>
    )
  }

  get user () {
    return this.props.user.info
  }

  forFollows () {
    const index = this.props.user.follows
    if (index.length < 1) {
      return null
    }
    return index.map(user =>
      <a key={user._id} href={'/' + user.username}>
        <Sheet hover>
          <SheetContent>
            <Typography>{user.name}@{user.username}</Typography>
          </SheetContent>
        </Sheet>
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
