import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'

const styleSheet = createStyleSheet('UISheetActions', theme => {
  return {
    container: {
      display: 'block',
      paddingTop: '10px',
      width: '100%'
    },
    alignRight: {
      textAlign: 'right'
    },
    flexDisplay: {
      display: 'flex'
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
      flex
    } = this.props
    return (
      <div
        className={classNames(className, classes.container)}
        style={{
          display: flex ? 'flex' : 'inline-block',
          textAlign: align || 'left'
        }}>
        {this.props.children}
      </div>
    )
  }
}
