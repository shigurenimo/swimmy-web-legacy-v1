import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'
import { fade } from 'material-ui/styles/colorManipulator'
import Button from 'material-ui/Button'

export const styleSheet = createStyleSheet('UIInputButton', theme => {
  return {
    background: {
      backgroundColor: 'rgba(0, 0, 0, 0.02)'
    },
    primary: {
      background: fade(theme.palette.text.primary, 0.12),
      '&:hover': {
        background: fade(theme.palette.text.primary, 0.12)
      }
    }
  }
})

@withStyles(styleSheet)
export default class extends Component {
  render () {
    const {
      classes,
      primary,
      background,
      ...more
    } = this.props
    return (
      <Button
        {...more}
        className={classNames({
          [classes.background]: background,
          [classes.primary]: primary
        })}
        onClick={this.props.onClick}>
        {this.props.children}
      </Button>
    )
  }
}
