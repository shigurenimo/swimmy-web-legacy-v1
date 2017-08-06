import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Layout from '/client/components/UI-Layout'
import Sheet from '/client/components/UI-Sheet'
import SheetContent from '/client/components/UI-SheetContent'
import CardBucket from '../CardBucket'
import CardNewBucket from '../CardNewBucket'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('buckets')
@observer
export default class Explore extends Component {
  render () {
    return (
      <Layout>
        <div className={this.props.classes.root}>
          <Grid container spacing={24}>
            <Grid item xs={12}>
              <CardNewBucket />
            </Grid>
            {this.forEach()}
          </Grid>
        </div>
      </Layout>
    )
  }

  forEach () {
    if (this.props.buckets.index.length === 0) {
      return (
        <Sheet>
          <SheetContent>
            <Typography>
              {this.props.buckets.fetchState ? '読み込み中 ..' : ''}
            </Typography>
          </SheetContent>
        </Sheet>
      )
    }
    return this.props.buckets.index.map(item => {
      return (
        <Grid item key={item._id} xs={12}>
          <CardBucket {...item} />
        </Grid>
      )
    })
  }

  componentDidMount () {
    this.context.onScrollTop()
  }

  static get contextTypes () {
    return {
      onScrollTop: propTypes.any
    }
  }
}
