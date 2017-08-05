import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'

export const styleSheet = createStyleSheet('UIButton', theme => {
  return {
    background: {
      backgroundColor: 'rgba(0, 0, 0, 0.03)'
    },
    selected: {
      background: theme.palette.primary[100],
      '&:hover': {
        background: theme.palette.primary[200]
      }
    }
  }
})

@withStyles(styleSheet)
export default class extends Component {
  render () {
    const {
      classes,
      selected,
      background,
      className,
      ...other
    } = this.props
    return (
      <Button
        {...other}
        className={classNames({
          [className]: className,
          [classes.background]: background,
          [classes.selected]: selected
        })}
        onClick={this.props.onClick}>
        {this.props.children}
      </Button>
    )
  }
}
