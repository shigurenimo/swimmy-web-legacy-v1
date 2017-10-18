import withStyles  from 'material-ui/styles/withStyles'
import Button from 'material-ui/Button'
import KeyboardArrowLeftIcon from 'material-ui-icons/KeyboardArrowLeft'
import KeyboardArrowRight from 'material-ui-icons/KeyboardArrowRight'
import { inject, observer } from 'mobx-react'
import compose from 'ramda/src/compose'
import React, { Component } from 'react'

import styles from './index.style'

class DrawerButton extends Component {
  render () {
    const {drawer, classes} = this.props
    return (
      <div className={classes.root}>
        <Button fab
          color='primary'
          className={classes.button}
          onClick={drawer.toggle}>
          {drawer.isOpen
            ? <KeyboardArrowRight />
            : <KeyboardArrowLeftIcon />}
        </Button>
      </div>
    )
  }
}

export default compose(
  withStyles(styles),
  inject('drawer'),
  observer
)(DrawerButton)
