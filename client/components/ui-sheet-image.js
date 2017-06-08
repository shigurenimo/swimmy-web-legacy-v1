import React, { Component } from 'react'
import { createStyleSheet, withStyles } from 'material-ui/styles'

const styleSheet = createStyleSheet('UIImage', theme => {
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
      borderRadius: '1px',
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
      src
    } = this.props
    if (href) {
      return (
        <a className={classes.link} href={href}>
          <img className={classes.image} src={src} />
        </a>
      )
    } else {
      return (
        <img className={classes.image} src={src} />
      )
    }
  }
}
