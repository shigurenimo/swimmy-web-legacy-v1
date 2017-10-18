import Snackbar from 'material-ui/Snackbar'
import { inject, observer } from 'mobx-react'
import compose from 'ramda/src/compose'
import React, { Component } from 'react'

class Snackbars extends Component {
  render () {
    const {snackbar} = this.props
    return (
      <Snackbar
        anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
        open={snackbar.isOpen}
        message={
          <span>{snackbar.message}</span>
        } />
    )
  }
}

export default compose(
  inject(stores => ({snackbar: stores.snackbar})),
  observer
)(Snackbars)
