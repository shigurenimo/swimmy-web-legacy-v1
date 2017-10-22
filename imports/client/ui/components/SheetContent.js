import classNames from 'classnames'
import withStyles from 'material-ui/styles/withStyles'
import { CardContent } from 'material-ui/Card'
import React, { Component } from 'react'

class SheetContent extends Component {
  render () {
    const {
      classes,
      className,
      dense,
      ...other
    } = this.props
    return (
      <CardContent
        {...other}
        className={classNames(classes.root, {
          [className]: className,
          [classes.dense]: dense
        })}>
        {this.props.children}
      </CardContent>
    )
  }
}

export const styles = {
  root: {},
  dense: {
    paddingTop: 0,
    paddingBottom: 0
  }
}

export default withStyles(styles)(SheetContent)
