import classNames from 'classnames'
import withStyles from 'material-ui/styles/withStyles'
import { CardActions } from 'material-ui/Card'
import React, { Component } from 'react'

class SheetActions extends Component {
  render () {
    const {
      classes,
      className,
      ...other
    } = this.props
    return (
      <CardActions
        {...other}
        className={classNames(className, classes.root)}>
        {this.props.children}
      </CardActions>
    )
  }
}

export const styles = {
  root: {
    height: 'auto'
  }
}

export default withStyles(styles)(SheetActions)
