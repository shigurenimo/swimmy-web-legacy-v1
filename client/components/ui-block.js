import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'

const styleSheet = createStyleSheet('UIBlock', theme => {
  return {
    container: {
      display: 'block',
      width: '100%',
      maxWidth: '300px',
      borderBottom: 'none',
      transitionDuration: '200ms'
    },
    hover: {
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)'
      }
    },
    center: {
      margin: '0 auto'
    }
  }
})

@withStyles(styleSheet)
export default class UILayout extends Component {
  render () {
    const {
      classes,
      hover,
      href,
      center,
      width
    } = this.props
    const Component = href ? 'a' : 'div'
    return (
      <Component
        className={classNames(classes.container, {
          [classes.hover]: hover,
          [classes.center]: center
        })}
        style={{maxWidth: width || 300}}
        href={href}>
        {this.props.children}
      </Component>
    )
  }
}
