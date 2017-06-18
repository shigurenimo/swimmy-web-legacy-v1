import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'

export const styleSheet = createStyleSheet('UIButton', theme => {
  return {
    background: {
      backgroundColor: 'rgba(0, 0, 0, 0.05)'
    },
    selected: {
      background: theme.palette.primary[100],
      '&:hover': {
        background: theme.palette.primary[200]
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
      selected,
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
          [classes.selected]: selected,
          [classes.minimal]: minimal
        })}
        onClick={this.props.onClick}>
        {this.props.children}
      </Button>
    )
  }
}
