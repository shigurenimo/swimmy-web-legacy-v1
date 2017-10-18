import withStyles from 'material-ui/styles/withStyles'
import React, { Component } from 'react'

class FlexGrow extends Component {
  render () {
    return (
      <div className={this.props.classes.root} />
    )
  }
}

export const styles = {
  root: {
    flex: '1 1 auto'
  }
}

export default withStyles(styles)(FlexGrow)
