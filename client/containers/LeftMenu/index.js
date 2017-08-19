import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import LeftMenuDefault from './ListDefault'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('routes', 'accounts')
@observer
export default class LeftMenu extends Component {
  render () {
    const {classes, routes, accounts} = this.props
    if (accounts.isLoggingIn) { return null }
    if (!routes.page) { return null }
    return (
      <div
        className={classes.root}>
        <LeftMenuDefault />
      </div>
    )
  }
}
