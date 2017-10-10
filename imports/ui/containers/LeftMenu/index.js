import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import LeftMenuDefault from './ListDefault'
import styles from './index.style'

@withStyles(styles)
@observer
export default class LeftMenu extends Component {
  render () {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <LeftMenuDefault />
      </div>
    )
  }
}
