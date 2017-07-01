import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'

const styleSheet = createStyleSheet('UISheet', theme => {
  return {
    container: {
      position: 'relative',
      display: 'block',
      width: '100%',
      borderBottom: 'none',
      transitionDuration: '200ms',
      boxSizing: 'border-box',
      textDecoration: 'none'
    },
    padding: {
      padding: '10px 10px 20px 10px'
    },
    paddingDense: {
      padding: '0px 10px 10px 10px'
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
      ...more
    } = this.props
    if (href) {
      return (
        <Typography
          {...more}
          className={classNames(classes.container, {
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
          {...more}
          className={classNames(classes.container, {
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
