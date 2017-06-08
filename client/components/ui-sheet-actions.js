import React, { Component } from 'react'
import { createStyleSheet, withStyles } from 'material-ui/styles'

const styleSheet = createStyleSheet('UISheetActions', theme => {
  return {
    container: {
      display: 'block',
      paddingTop: '10px',
      width: '100%'
    }
  }
})

@withStyles(styleSheet)
export default class UILayout extends Component {
  render () {
    const {
      classes
    } = this.props
    return (
      <div className={classes.container}>
        {this.props.children}
      </div>
    )
  }
}
