import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'
import { fade } from 'material-ui/styles/colorManipulator'

export const styleSheet = createStyleSheet('UIInlineBlock', theme => {
  return {
    container: {
      display: 'inline-block',
      verticalAlign: 'top',
      padding: '0 10px',
      width: 'auto',
      height: '33px',
      lineHeight: '33px',
      textAlign: 'center',
      color: theme.palette.text.primary,
      backgroundColor: fade(theme.palette.text.primary, 0.12),
      borderRadius: 1,
      borderBottom: 'none',
      transitionDuration: '200ms'
    },
    primary: {
      background: theme.palette.text.primary,
      color: 'white'
    }
  }
})

@withStyles(styleSheet)
export default class extends Component {
  render () {
    const {classes, primary} = this.props
    return (
      <div
        className={classNames(classes.container, {
          [classes.primary]: primary
        })}>
        {this.props.children}
      </div>
    )
  }
}
