import { observer } from 'mobx-react'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import styles from './index.style'

@withStyles(styles)
@observer
export default class NotFound extends Component {
  render () {
    return (
      <div className={this.props.classes.root}>
        <Typography type='display2' align='center'>404</Typography>
      </div>
    )
  }
}
