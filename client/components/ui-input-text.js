import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import { createStyleSheet } from 'material-ui/styles'

export const styleSheet = createStyleSheet('UIInputText', theme => {
  return {
    container: {
      displayInline: 'block',
      verticalAlign: 'top',
      padding: '5px 10px',
      width: '100%',
      maxWidth: 280,
      height: 30,
      lineHeight: 20,
      textAlign: 'center',
      color: Meteor.settings.public.color.primary,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      cursor: 'pointer',
      borderRadius: 1,
      borderBottom: 'none',
      transitionDuration: '200ms',
      '&:placeholder-shown': {
        color: 'rgba(0, 0, 0, 0.6)' // TODO: primary 0.6
      },
      ' &:hover:placeholder-shown': {
        color: 'rgba(0, 0, 0, 0.8)' // primary 0.8
      },
      '&:focus:placeholder-shown': {
        color: 'rgba(255, 255, 255, 0.8)'
      },
      '&::-webkit-input-placeholder': {
        color: 'rgba(0, 0, 0, 0.6)' // primary 0.6
      },
      '&:hover::-webkit-input-placeholder': {
        color: 'rgba(255, 255, 255, 0.8)'
      },
      '&:focus::-webkit-input-placeholder': {
        color: 'rgba(255, 255, 255, 0.8)'
      },
      '&::-moz-placeholder': {
        color: 'rgba(0, 0, 0, 0.6)'
      },
      '&:hover::-moz-placeholder': {
        color: 'rgba(0, 0, 0, 0.8)'
      },
      '&:focus::-moz-placeholder': {
        color: 'rgba(255, 255, 255, 0.8)'
      },
      '&:-ms-input-placeholder': {
        color: 'rgba(0, 0, 0, 0.6)'
      },
      '&:hover:-ms-input-placeholder': {
        color: 'rgba(0, 0, 0, 0.8)'
      },
      '&:focus:-ms-input-placeholder': {
        color: 'rgba(255, 255, 255, 0.8)'
      },
      '&:hover': {
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
      },
      '&:focus': {
        cursor: 'auto',
        color: 'white',
        backgroundColor: Meteor.settings.public.color.primary
      }
    }
  }
})

export default class extends Component {
  render () {
    const props = {}
    if (this.props.onBlur) { props.onBlur = this.props.onBlur }
    return (
      <input
        {...props}
        className='ui-input-text'
        value={this.props.value}
        placeholder={this.props.placeholder}
        maxLength={this.props.maxLength || 100}
        onChange={this.props.onChange}>
        {this.props.children}
      </input>
    )
  }
}
