import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import TextField from 'material-ui/TextField'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject(stores => {
  return {
    routes: stores.routes,
    explore: stores.explore
  }
})
@observer
export default class InputExplore extends Component {
  render () {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        <form onSubmit={this.onSubmit}>
          <TextField fullWidth
            label='word'
            onChange={this.onChangeWord} />
        </form>
      </div>
    )
  }

  onChangeWord (event) {
    const {value} = event.target
    this.props.explore.setWord(value)
  }

  onChangeWord = ::this.onChangeWord

  onSubmit (event) {
    event.preventDefault()
    const word = this.props.explore.word
    this.props.routes.go('/explore?word=' + word)
  }

  onSubmit = ::this.onSubmit
}
