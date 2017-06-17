import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'
import { fade } from 'material-ui/styles/colorManipulator'
import Button from 'material-ui/Button'

export const styleSheet = createStyleSheet('UIButton', theme => {
  return {
    background: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)'
    },
    primary: {
      background: fade(theme.palette.text.primary, 0.12),
      '&:hover': {
        background: fade(theme.palette.text.primary, 0.12)
      }
    },
    minimal: {
      fontSize: 12,
      height: '25px'
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
      className,
      minimal,
      ...more
    } = this.props
    return (
      <Button
        {...more}
        className={classNames({
          [className]: className,
          [classes.background]: background,
          [classes.primary]: primary,
          [classes.minimal]: minimal
        })}
        onClick={this.props.onClick}>
        {this.props.children}
      </Button>
    )
  }
}