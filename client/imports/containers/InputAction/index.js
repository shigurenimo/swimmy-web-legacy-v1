import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import { withStyles } from 'material-ui/styles'
import InputPost from '../InputPost'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('router', 'accounts') @observer
export default class InputAction extends Component {
  render () {
    const {classes} = this.props
    return (
      <CSSTransitionGroup
        component='div'
        transitionName={{
          enter: classes.transitionEnter,
          enterActive: classes.transitionEnterActive,
          leave: classes.transitionLeave,
          leaveActive: classes.transitionLeaveActive,
          appear: classes.transitionAppear,
          appearActive: classes.transitionAppearActive
        }}
        transitionEnterTimeout={450}
        transitionLeaveTimeout={150}
        transitionAppear
        transitionAppearTimeout={150}>
        {this.router()}
      </CSSTransitionGroup>
    )
  }

  router () {
    const {classes} = this.props
    if (this.props.router.page === null) {
      return <div />
    }
    if (this.props.accounts.isLoggingIn) {
      return <div />
    }
    switch (this.props.router.page) {
      case 'timeline':
      case 'timemachine':
      case 'thread':
      case 'channel-info':
        return <InputPost key='input-post' />
      default:
        return <div className={classes.inputLine} key='default' />
    }
  }
}
