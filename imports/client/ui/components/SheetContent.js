import classNames from 'classnames'
import withStyles from 'material-ui/styles/withStyles'
import { CardContent } from 'material-ui/Card'
import React, { Component } from 'react'

class SheetContent extends Component {
  render () {
    const {
      classes,
      className,
      ...other
    } = this.props
    return (
      <CardContent
        {...other}
        className={classNames(classes.root, className)}>
        {this.props.children}
      </CardContent>
    )
  }
}

export const styles = {
  root: {}
}

export default withStyles(styles)(SheetContent)
