import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'
import FlexGrow from '/client/components/FlexGrow'
import Button from 'material-ui/Button'
import Card, { CardActions, CardContent } from 'material-ui/Card'
import Typography from 'material-ui/Typography'
import styles from './index.style'

@withStyles(styles)
@inject('buckets')
@observer
export default class CardBucket extends Component {
  render () {
    return (
      <Card>
        <CardContent>
          <Typography gutterBottom type='title'>
            {this.props.extension.name}
          </Typography>
          <Typography>
            {this.props.extension.note}
          </Typography>
        </CardContent>
        <CardActions>
          <FlexGrow />
          <Button
            color='accent'
            onClick={this.onDeleteBucket}>delete</Button>
          <Button raised color='primary'>open</Button>
        </CardActions>
      </Card>
    )
  }

  onDeleteBucket () {
    this.props.buckets.remove(this.props._id)
  }

  onDeleteBucket = ::this.onDeleteBucket
}
