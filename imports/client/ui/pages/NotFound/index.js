import withStyles  from 'material-ui/styles/withStyles'
import Typography from 'material-ui/Typography'
import React, { Component } from 'react'

import styles from './index.style'

class NotFound extends Component {
  render () {
    return (
      <div className={this.props.classes.root}>
        <Typography type='display2' align='center'>404</Typography>
      </div>
    )
  }
}

export default withStyles(styles)(NotFound)
