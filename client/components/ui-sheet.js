import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'

const styleSheet = createStyleSheet('UISheet', theme => {
  return {
    container: {
      display: 'block',
      padding: '10px 10px 20px 10px',
      width: '100%',
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
