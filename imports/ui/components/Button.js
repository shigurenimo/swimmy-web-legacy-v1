import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'

export const styles = theme => {
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
}

@withStyles(styles)
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
        })}>
        {this.props.children}
      </Button>
    )
  }
}
