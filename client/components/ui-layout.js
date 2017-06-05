import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'

const styleSheet = createStyleSheet('UILayout', theme => {
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
      hover
    } = this.props
    return (
      <div className={classNames(classes.container, {
        [classes.hover]: hover
      })}>
        {this.props.children}
      </div>
    )
  }
}
