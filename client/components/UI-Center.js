import React, { Component } from 'react'
import { createStyleSheet, withStyles } from 'material-ui/styles'

const styleSheet = createStyleSheet('UICenter', theme => {
  return {
    container: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      margin: 'auto'
    }
  }
})

@withStyles(styleSheet)
export default class UICenter extends Component {
  render () {
    const {
      classes,
      width,
      height
    } = this.props
    return (
      <div
        className={classes.container}
        style={{width, height}}>
        {this.props.children}
      </div>
    )
  }
}
