import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'

const styleSheet = createStyleSheet('UISheetActions', theme => {
  return {
    root: {
      display: 'block',
      marginBottom: '5px',
      width: '100%'
    },
    alignRight: {
      textAlign: 'right'
    },
    flexDisplay: {
      display: 'flex'
    },
    dense: {
      marginBottom: 0
    }
  }
})

@withStyles(styleSheet)
export default class UILayout extends Component {
  render () {
    const {
      classes,
      className,
      align,
      flex,
      dense,
      ...other
    } = this.props
    return (
      <div
        {...other}
        className={classNames(
          classes.root, {
            [className]: className,
            [classes.dense]: dense
          })}
        style={{
          display: flex ? 'flex' : 'inline-block',
          textAlign: align || 'left'
        }}>
        {this.props.children}
      </div>
    )
  }
}
