import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('buckets')
@observer
export default class CardNewBucket extends Component {
  render () {
    return (
      <div className={this.props.root}>
        <Typography type='title'>new Bucket</Typography>
        <TextField fullWidth
          label='name'
          value={this.state.name}
          onChange={this.onChangeName}
          margin='normal' />
        <TextField fullWidth multiline
          label='note'
          value={this.state.note}
          onChange={this.onChangeNote}
          margin='normal' />
        <Typography align='center'>
          <Button onClick={this.onSubmit}>
            create
          </Button>
        </Typography>
      </div>
    )
  }

  state = {
    name: '',
    note: ''
  }

  onChangeName (event) {
    const {value} = event.target
    this.setState({name: value})
  }

  onChangeName = ::this.onChangeName

  onChangeNote (event) {
    const {value} = event.target
    this.setState({note: value})
  }

  onChangeNote = ::this.onChangeNote

  onSubmit () {
    this.props.buckets.insert({
      extension: {
        name: this.state.name,
        note: this.state.note
      }
    })
  }

  onSubmit = ::this.onSubmit
}
