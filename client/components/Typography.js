import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import MUITypography from 'material-ui/Typography'

export const styles = theme => {
  return {
    inline: {
      display: 'inline'
    }
  }
}

@withStyles(styles)
export default class Typography extends Component {
  render () {
    const {classes, className, inline, ...other} = this.props
    return (
      <MUITypography
        {...other}
        className={classNames({
          [className]: className,
          [classes.inline]: inline
        })} />
    )
  }
}
