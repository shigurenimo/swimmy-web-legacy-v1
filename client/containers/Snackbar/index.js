import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import Card from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('layout', 'snackbar', 'router')
@observer
export default class Snackbar extends Component {
  render () {
    const {
      classes,
      snackbar
    } = this.props
    return (
      <div
        className={classNames(classes.container, {
          [classes.on]: snackbar.isShow,
          [classes.off]: !snackbar.isShow
        })}>
        <Card className={classes.inner}>
          {this.props.snackbar.message &&
          <Typography className={classes.text}>
            {this.props.snackbar.message}
          </Typography>}
        </Card>
      </div>
    )
  }

  // ヘッダーが最小化されているかどうか
  get isMinimal () {
    switch (this.props.router.page) {
      case 'home':
        return false
    }
    if (this.props.layout.scrollOver) {
      return true
    }
  }
}
