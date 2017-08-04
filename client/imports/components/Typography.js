import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'
import MUITypography from 'material-ui/Typography'

export const styleSheet = createStyleSheet('UITypography', theme => {
  return {
    inline: {
      display: 'inline'
    }
  }
})

@withStyles(styleSheet)
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
