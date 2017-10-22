import withStyles from 'material-ui/styles/withStyles'
import Typography from 'material-ui/Typography'
import React from 'react'

export const NowLoading = props =>
  <div className={props.classes.root}>
    <Typography>読み込み中...</Typography>
  </div>

export const styles = {
  root: {
    padding: '20px'
  }
}

export default withStyles(styles)(NowLoading)
