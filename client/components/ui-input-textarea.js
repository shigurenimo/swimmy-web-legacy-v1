import React, { Component } from 'react'
import { createStyleSheet, withStyles } from 'material-ui/styles'

export const styleSheet = createStyleSheet('UIInputTextarea', theme => {
  return {
    container: {
      padding: '10px',
      width: '100%',
      height: 1.5 * 6 + 'rem',
      lineHeight: 1.5 + 'rem',
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderRadius: '2px',
      cursor: 'pointer',
      transitionDuration: '200ms'
    },
    '&:placeholder-shown': {
      color: 'rgba(0, 0, 0, 0.6)'
    },
    '&:hover:placeholder-shown': {
      color: 'rgba(0, 0, 0, 0.8)'
    },
    '&:focus:placeholder-shown': {
      color: 'rgba(0, 0, 0, 0.2)'
    },
    '&::-webkit-input-placeholder': {
      color: 'rgba(0, 0, 0, 0.6)'
    },
    '&:hover::-webkit-input-placeholder': {
      color: 'rgba(0, 0, 0, 0.8)'
    },
    '&:focus::-webkit-input-placeholder': {
      color: 'rgba(0, 0, 0, 0.2)'
    },
    '&::-moz-placeholder': {
      color: 'rgba(0, 0, 0, 0.6)'
    },
    '&:hover::-moz-placeholder': {
      color: 'rgba(0, 0, 0, 0.8)'
    },
    '&:focus::-moz-placeholder': {
      color: 'rgba(0, 0, 0, 0.2)'
    },
    '&:-ms-input-placeholder': {
      color: 'rgba(0, 0, 0, 0.6)'
    },
    '&:hover:-ms-input-placeholder': {
      color: 'rgba(0, 0, 0, 0.8)'
    },
    '&:focus:-ms-input-placeholder': {
      color: 'rgba(0, 0, 0, 0.2)'
    },
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)'
    },
    '&:focus': {
      cursor: 'auto',
      backgroundolor: 'rgba(0, 0, 0, 0.05)'
    }
  }
})

@withStyles(styleSheet)
export default class extends Component {
  render () {
    const {
      classes,
      value
    } = this.props
    return (
      <textarea
        className={classes.container}
        placeholder={this.props.placeholder}
        onChange={this.props.onChange}
        rows={4}
        maxLength='1000'
        value={value} />
    )
  }
}
