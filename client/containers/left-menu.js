import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import LeftMenuDefault from './left-menu-default'

@inject('layout', 'router', 'user')
@observer
export default class LeftMenu extends Component {
  render () {
    return <CSSTransitionGroup
      className={this.className}
      component='div'
      transitionName='transition-side'
      transitionEnterTimeout={450}
      transitionLeaveTimeout={150}
      transitionAppear={true}
      transitionAppearTimeout={150}>
      {this.router()}
    </CSSTransitionGroup>
  }

  get className () {
    return `container:left-menu ${this.props.layout.oneColumnClassName}`
  }

  router () {
    if (this.props.user.isLoggingIn) {
      return null
    }
    if (!this.props.router.page) {
      return null
    }
    return <LeftMenuDefault key='default'/>
  }
}
