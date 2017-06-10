import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'

const styleSheet = createStyleSheet('UIBlock', theme => {
  return {
    container: {
      display: 'block',
      margin: '0 auto',
      width: '100%',
      maxWidth: '300px',
      borderBottom: 'none',
      transitionDuration: '200ms'
    },
    hover: {
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.05)'
      }
    }
  }
})

@withStyles(styleSheet)
export default class UILayout extends Component {
  render () {
    const {
      classes,
      hover,
      href
    } = this.props
    const Component = href ? 'a' : 'div'
    return (
      <Component
        className={classNames(classes.container, {
          [classes.hover]: hover
        })}
        href={href}>
        {this.props.children}
      </Component>
    )
  }
}
