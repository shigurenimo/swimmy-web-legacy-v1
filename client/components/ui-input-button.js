import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet, withStyles } from 'material-ui/styles'

export const styleSheet = createStyleSheet('UIInputButton', theme => {
  return {
    container: {
      display: 'inline-block',
      verticalAlign: 'top',
      padding: '0 10px',
      width: 'auto',
      height: 30,
      lineHeight: 30,
      textAlign: 'center',
      color: Meteor.settings.public.color.primary,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      cursor: 'pointer',
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
      <button
        className={classNames('ui-input-button', {
          [classes.primary]: primary
        })}
        onTouchTap={this.props.onClick}>
        {this.props.children}
      </button>
    )
  }
}
