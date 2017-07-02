import React, { Component } from 'react'
import { createStyleSheet, withStyles } from 'material-ui/styles'

const styleSheet = createStyleSheet('UISheetBackgroundImage', theme => {
  return {
    link: {
      display: 'inline-block',
      border: 'none'
    },
    image: {
      position: 'relative',
      marginTop: '5px',
      width: '100%',
      maxWidth: '600px',
      height: '200px',
      backgroundColor: 'skyblue',
      backgroundPosition: 'center center',
      backgroundSize: 'cover',
      borderRadius: '2px',
      cursor: 'pointer'
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
          <div
            className={classes.image}
            style={{
              backgroundImage: 'url(' + src + ')'
            }} />
        </a>
      )
    } else {
      return (
        <div
          className={classes.image}
          style={{
            backgroundImage: 'url(' + src + ')'
          }} />
      )
    }
  }
}
