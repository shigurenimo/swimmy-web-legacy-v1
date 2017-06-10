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
      href,
      center,
      width
    } = this.props
    const Component = href ? 'a' : 'div'
    return (
      <Component
        className={classNames(classes.container, {
          [classes.center]: center
        })}
        style={{maxWidth: width ? (width + 'px') : '300px'}}
        href={href}>
        {this.props.children}
      </Component>
    )
  }
}
