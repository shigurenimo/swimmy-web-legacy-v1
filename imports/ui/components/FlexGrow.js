import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'

export const styles = theme => {
  return {
    root: {
      flex: '1 1 auto'
    }
  }
}

@withStyles(styles)
export default class UIFlexGrow extends Component {
  render () {
    return (
      <div className={this.props.classes.root} />
    )
  }
}
