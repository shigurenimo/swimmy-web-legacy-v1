import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject(stores => {
  return {
    routes: stores.routes
  }
})
@observer
export default class InputExplore extends Component {
  render () {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <TextField label='word' />
      </div>
    )
  }
}
