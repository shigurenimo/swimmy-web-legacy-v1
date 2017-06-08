import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'

export const styleSheet = createStyleSheet('UIInlineBlock', theme => {
  return {
    container: {
      display: 'inline-block',
      verticalAlign: 'top',
      padding: '0 10px',
      width: 'auto',
      height: '30px',
      lineHeight: '30px',
      textAlign: 'center',
      color: Meteor.settings.public.color.primary,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: 1,
      borderBottom: 'none',
      transitionDuration: '200ms'
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
    const {classes, primary} = this.props
    return (
      <div
        className={classNames(classes.container, {
          [classes.primary]: primary
        })}>
        {this.props.children}
      </div>
    )
  }
}
