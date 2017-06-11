import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'

const styleSheet = createStyleSheet('UIImage', theme => {
  return {
    container: {
      position: 'block',
      maxWidth: '600px'
    }
  }
})

@withStyles(styleSheet)
export default class UIImage extends Component {
  render () {
    const {
      classes,
      className,
      src,
      onClick,
      ...more
    } = this.props
    return (
      <img
        {...more}
        className={classNames(classes.container, {
          [className]: className
        })}
        src={src} />
    )
  }
}
