import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import InputExplore from '../InputExplore'
import InputPost from '../InputPost'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('routes', 'accounts')
@observer
export default class InputAction extends Component {
  render () {
    const {classes} = this.props
    if (this.props.routes.page === null) {
      return null
    }
    if (this.props.accounts.isLoggingIn) {
      return null
    }
    switch (this.props.routes.page) {
      case 'timeline':
      case 'timemachine':
      case 'thread':
      case 'channel-info':
        return <InputPost />
      case 'explore':
        return <InputExplore />
      default:
        return <div className={classes.line} />
    }
  }
}
