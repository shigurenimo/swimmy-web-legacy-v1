import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'

const styleSheet = createStyleSheet('UISheet', theme => {
  return {
    container: {
      position: 'relative',
      display: 'block',
      width: '100%',
      borderBottom: 'none',
      transitionDuration: '200ms'
    },
    padding: {
      padding: '10px 10px 20px 10px'
    },
    paddingMinimal: {
      padding: '0px 10px 10px 10px'
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
      minimal,
      href,
      ...more
    } = this.props
    const Component = href ? 'a' : 'div'
    return (
      <Component
        {...more}
        className={classNames(classes.container, {
          [classes.paddingMinimal]: minimal,
          [classes.padding]: !minimal,
          [classes.hover]: hover
        })}
        href={href}>
        {this.props.children}
      </Component>
    )
  }
}
