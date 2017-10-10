import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import InputExplore from '../InputExplore'
import InputPost from '../InputPost'
import styles from './index.style'

@withStyles(styles)
@inject('router', 'accounts')
@observer
export default class InputAction extends Component {
  render () {
    const {classes} = this.props
    if (this.props.accounts.isLoggingIn) {
      return null
    }
    switch (this.props.router.location.pathname) {
      case '/':
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
