import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'

const styleSheet = createStyleSheet('UIImage', theme => {
  return {
    container: {
      display: 'block',
      width: '100%',
      maxWidth: '250px',
      height: 'auto',
      '-webkit-touch-callout': 'default'
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
