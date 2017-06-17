import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import LeftMenuDefault from './left-menu-default'
import styleSheet from './left-menu.style'

@withStyles(styleSheet)
@inject('layout', 'router', 'users')
@observer
export default class LeftMenu extends Component {
  render () {
    const {classes, layout, router, users} = this.props
    if (users.isLoggingIn) {
      return null
    }
    if (!router.page) {
      return null
    }
    return (
      <div
        className={classNames(classes.container, {
          [classes.oneColumn]: layout.oneColumn
        })}>
        <LeftMenuDefault />
      </div>
    )
  }
}
