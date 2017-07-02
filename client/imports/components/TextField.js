import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'

export const styleSheet = createStyleSheet('UI-TextField', theme => {
  return {
    fullWidth: {
      width: '100%'
    }
  }
})

@withStyles(styleSheet)
export default class extends Component {
  render () {
    const {
      classes,
      className,
      fullWidth,
      ...more
    } = this.props
    return (
      <TextField
        {...more}
        className={classNames(className, {
          [classes.fullWidth]: fullWidth
        })}>
        {this.props.children}
      </TextField>
    )
  }
}
