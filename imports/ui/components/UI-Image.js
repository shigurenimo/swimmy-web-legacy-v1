import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'

const styles = theme => {
  return {
    root: {
      display: 'block',
      width: '100%',
      height: 'auto',
      '-webkit-touch-callout': 'default'
    }
  }
}

@withStyles(styles)
export default class UIImage extends Component {
  render () {
    const {
      classes,
      className,
      src,
      ...other
    } = this.props
    return (
      <img
        {...other}
        className={classNames(classes.root, {
          [className]: className
        })}
        src={src} />
    )
  }
}
