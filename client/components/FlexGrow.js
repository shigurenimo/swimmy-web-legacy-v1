import React, { Component } from 'react'
import { createStyleSheet, withStyles } from 'material-ui/styles'

export const styleSheet = createStyleSheet('FlexGrow', theme => {
  return {
    container: {
      flex: '1 1 auto'
    }
  }
})

@withStyles(styleSheet)
export default class UIFlexGrow extends Component {
  render () {
    return (
      <div className={this.props.classes.container} />
    )
  }
}
