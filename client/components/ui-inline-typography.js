import React, { Component } from 'react'
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
    const {classes} = this.props
    return (
      <Typography
        className={classes.container}>
        {this.props.children}
      </Typography>
    )
  }
}
