import React, { Component } from 'react'
import { createStyleSheet, withStyles } from 'material-ui/styles'

const styleSheet = createStyleSheet('UILayout', theme => {
  return {
    container: {
      paddingBottom: 50
    }
  }
})

@withStyles(styleSheet)
export default class UILayout extends Component {
  render () {
    const {classes} = this.props
    return (
      <div className={classes.container}>
        {this.props.children}
      </div>
    )
  }
}
