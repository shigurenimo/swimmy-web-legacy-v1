import classNames from 'classnames'
import withStyles  from 'material-ui/styles/withStyles'
import React, { Component } from 'react'

class SheetImage extends Component {
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
        className={classNames(classes.image, {
          [className]: className
        })} src={src} />
    )
  }
}

export const styles = {
  link: {
    display: 'inline-block',
    border: 'none'
  },
  image: {
    display: 'block',
    width: '100%',
    maxWidth: '600px',
    minHeight: '100px',
    paddingTop: '10px',
    borderRadius: '1px'
  },
  hover: {
    '&:hover': {
      opacity: 0.8
    }
  }
}

export default withStyles(styles)(SheetImage)
