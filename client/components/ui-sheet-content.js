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
      ...more
    } = this.props
    return (
      <div
        {...more}
        className={classes.container}
        style={{
          textAlign: align || 'left'
        }}>
        {this.props.children}
      </div>
    )
  }
}
