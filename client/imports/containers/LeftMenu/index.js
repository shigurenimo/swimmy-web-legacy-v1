import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import LeftMenuDefault from './ListDefault'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('layout', 'routes', 'accounts')
@observer
export default class LeftMenu extends Component {
  render () {
    const {classes, layout, routes, accounts} = this.props
    if (accounts.isLoggingIn) {
      return null
    }
    if (!routes.page) {
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
