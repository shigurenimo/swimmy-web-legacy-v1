import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'

const styleSheet = createStyleSheet('UISheet', theme => {
  return {
    root: {
      position: 'relative',
      display: 'block',
      width: '100%',
      borderBottom: 'none',
      transitionDuration: '200ms',
      boxSizing: 'border-box',
      textDecoration: 'none',
      '-webkit-tap-highlight-color': 'rgba(0,0,0,0)'
    },
    padding: {
      padding: '20px 10px 10px 10px'
    },
    paddingDense: {
      padding: '10px 10px 5px 10px'
    },
    hover: {
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)'
      }
    },
    background: {
      backgroundColor: 'rgba(0, 0, 0, 0.02)'
    }
  }
})

@withStyles(styleSheet)
export default class UILayout extends Component {
  render () {
    const {
      classes,
      hover,
      dense,
      background,
      href,
      className,
      ...other
    } = this.props
    if (href) {
      return (
        <Typography
          {...other}
          className={classNames(className, classes.root, {
            [classes.paddingDense]: dense,
            [classes.padding]: !dense,
            [classes.hover]: hover,
            [classes.background]: background
          })}
          component='a'
          href={href}>
          {this.props.children}
        </Typography>
      )
    } else {
      return (
        <div
          {...other}
          className={classNames(className, classes.root, {
            [classes.paddingDense]: dense,
            [classes.padding]: !dense,
            [classes.hover]: hover,
            [classes.background]: background
          })}>
          {this.props.children}
        </div>
      )
    }
  }
}
