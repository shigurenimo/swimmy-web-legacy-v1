import React, { Component } from 'react'
import { createStyleSheet, withStyles } from 'material-ui/styles'

const styleSheet = createStyleSheet('UIBlock', theme => {
  return {
    container: {
      display: 'block',
      padding: '20px 10px 20px 10px',
      width: '100%',
      borderBottom: 'none',
      transitionDuration: '200ms'
    },
    hover: {
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
      }
    }
  }
})

@withStyles(styleSheet)
export default class extends Component {
  render () {
    const {classes} = this.props
    return (
      <div className={classes.container}>
        {this.props.children}
      </div>
    )
  }
}
