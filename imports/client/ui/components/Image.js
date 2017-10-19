import classNames from 'classnames'
import withStyles from 'material-ui/styles/withStyles'
import React, { Component } from 'react'

class Image extends Component {
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

export const styles = {
  root: {
    display: 'block',
    width: '100%',
    height: 'auto',
    '-webkit-touch-callout': 'default'
  }
}

export default withStyles(styles)(Image)
