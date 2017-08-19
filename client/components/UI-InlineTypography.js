import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'

export const styles = theme => {
  return {
    root: {
      display: 'inline-block',
      verticalAlign: 'top',
      lineHeight: '36px'
    }
  }
}

@withStyles(styles)
export default class extends Component {
  render () {
    const {
      classes,
      className,
      ...other
    } = this.props
    return (
      <Typography
        {...other}
        className={classNames(classes.root, className)}>
        {this.props.children}
      </Typography>
    )
  }
}
