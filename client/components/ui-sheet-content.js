import React, { Component } from 'react'
import { createStyleSheet, withStyles } from 'material-ui/styles'

const styleSheet = createStyleSheet('UISheetContent', theme => {
  return {
    container: {
      paddingTop: '10px',
      position: 'relative',
      display: 'block',
      width: '100%'
    }
  }
})

@withStyles(styleSheet)
export default class UILayout extends Component {
  render () {
    const {
      classes,
      align,
      href,
      ...more
    } = this.props
    const Component = href ? 'a' : 'div'
    return (
      <Component
        {...more}
        className={classes.container}
        style={{
          textAlign: align || 'left'
        }}
        href={href}>
        {this.props.children}
      </Component>
    )
  }
}
