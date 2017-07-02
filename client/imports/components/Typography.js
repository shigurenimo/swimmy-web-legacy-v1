import React, { Component } from 'react'
import classNames from 'classnames'
import { createStyleSheet } from 'material-ui/styles'
import customPropTypes from 'material-ui/utils/customPropTypes'
import Typography from 'material-ui/Typography'

export const styleSheet = createStyleSheet('UITypography', theme => {
  return {
    inline: {
      display: 'inline'
    }
  }
})

export default class TypographyError extends Component {
  render () {
    const {className, inline, ...more} = this.props
    const classes = this.context.styleManager.render(styleSheet)
    return (
      <Typography {...more}
        className={classNames(className || '', {
          [classes.inline]: inline
        })} />
    )
  }

  static contextTypes = {
    styleManager: customPropTypes.muiRequired
  }
}
