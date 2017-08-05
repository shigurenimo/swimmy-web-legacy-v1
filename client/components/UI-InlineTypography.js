import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'

export const styleSheet = createStyleSheet('UIInlineTypograhy', theme => {
  return {
    container: {
      display: 'inline-block',
      verticalAlign: 'top',
      lineHeight: '36px'
    }
  }
})

@withStyles(styleSheet)
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
        className={classNames(classes.container, className)}>
        {this.props.children}
      </Typography>
    )
  }
}
