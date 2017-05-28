import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import InputPost from './input-post'

@inject('router', 'user')
@observer
export default class InputAction extends Component {
  render () {
    return <CSSTransitionGroup
      component='div'
      className='container:input-action'
      transitionName='transition'
      transitionEnterTimeout={450}
      transitionLeaveTimeout={150}
      transitionAppear
      transitionAppearTimeout={150}>
      {this.router()}
    </CSSTransitionGroup>
  }

  router () {
    if (this.props.router.page === null) {
      return null
    }
    if (this.props.user.isLoggingIn) {
      return null
    }
    switch (this.props.router.page) {
      case 'timeline':
      case 'timemachine':
      case 'thread':
      case 'network-info':
        return <InputPost key='input-post' />
      default:
        return <div className='block:input-line' key='default' />
    }
  }
}
