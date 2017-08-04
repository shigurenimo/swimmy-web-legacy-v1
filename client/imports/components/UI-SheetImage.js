import React, { Component } from 'react'
import { createStyleSheet, withStyles } from 'material-ui/styles'
import classNames from 'classnames'

const styleSheet = createStyleSheet('UISheetImage', theme => {
  return {
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
})

@withStyles(styleSheet)
export default class UISheetImage extends Component {
  render () {
    const {
      classes,
      href,
      className,
      src,
      ...other
    } = this.props
    if (href) {
      return (
        <a
          {...other}
          className={classes.link} href={href}>
          <img className={classNames(classes.image, classes.hover, {
            [className]: className
          })} src={src} />
        </a>
      )
    } else {
      return (
        <img
          {...other}
          className={classNames(classes.image, {
            [className]: className
          })} src={src} />
      )
    }
  }
}
