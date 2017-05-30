import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import { createStyleSheet } from 'material-ui/styles'

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
    }
  }
})

export default class extends Component {
  render () {
    return (
      <button
        className='ui-input-button'
        onTouchTap={this.props.onClick}>
        {this.props.children}
      </button>
    )
  }
}
