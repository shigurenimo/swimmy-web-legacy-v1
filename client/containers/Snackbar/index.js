import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import Snackbar from 'material-ui/Snackbar'

@inject('snackbar')
@observer
export default class Snackbars extends Component {
  render () {
    const {snackbar} = this.props
    return (
      <Snackbar
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        open={snackbar.isOpen}
        message={
          <span>{snackbar.message}</span>
        }
      />
    )
  }
}
