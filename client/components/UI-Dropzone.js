import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import Dropzone from 'react-dropzone'
import { createStyleSheet, withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'

export const styleSheet = createStyleSheet('UIDropzone', theme => {
  return {
    container: {
      display: 'block',
      position: 'relative',
      maxWidth: '100%',
      height: 'auto',
      minHeight: '80px'
    },
    frame: {
      width: 'auto',
      minWidth: '200px',
      height: '100%',
      minHeight: '80px',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      border: `dashed 2px ${Meteor.settings.public.color.primary}`,
      borderRadius: '2px',
      overflow: 'hidden',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.07)'
      }
    },
    name: {
      position: 'absolute',
      margin: 'auto',
      top: 0,
      bottom: 0,
      width: '100%',
      height: '30px',
      fontSize: '1rem',
      letterSpacing: '2px',
      textAlign: 'center',
      lineHeight: '30px',
      color: Meteor.settings.public.color.primary,
      cursor: 'pointer'
    },
    primary: {
      background: Meteor.settings.public.color.primary,
      color: 'white'
    }
  }
})

@withStyles(styleSheet)
export default class extends Component {
  render () {
    const {
      classes,
      image,
      src,
      onDrop
    } = this.props
    return (
      <Dropzone
        className={classes.container}
        onDrop={onDrop}>
        <div className={classes.frame}>
          {image &&
          <img src={image.preview} />}
          {src &&
          <img src={src} />}
          {!image &&
          <Typography className={classes.name}>画像をドロップ or タップ</Typography>}
        </div>
      </Dropzone>
    )
  }
}
