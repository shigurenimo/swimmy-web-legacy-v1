import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Grid from 'material-ui/Grid'
import Typography from 'material-ui/Typography'
import Layout from '/imports/client/ui/components/Layout'
import Sheet from '/imports/client/ui/components/Sheet'
import SheetContent from '/imports/client/ui/components/SheetContent'
import CardBucket from '../CardBucket/index'
import CardNewBucket from '../CardNewBucket/index'
import styles from './index.style'

@withStyles(styles)
@inject('buckets')
@observer
export default class Explore extends Component {
  render () {
    return (
      <Layout>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <CardNewBucket />
          </Grid>
          {this.forBuckets}
        </Grid>
      </Layout>
    )
  }

  get buckets () { return this.props.buckets.model.get('root') }

  get forBuckets () {
    if (this.buckets.isEmpty) {
      return (
        <Sheet>
          <SheetContent>
            <Typography>
              {this.buckets.fetchState ? '読み込み中 ..' : ''}
            </Typography>
          </SheetContent>
        </Sheet>
      )
    }
    return this.buckets.index.map(item => {
      return (
        <Grid item key={item._id} xs={12}>
          <CardBucket {...item} />
        </Grid>
      )
    })
  }

  componentDidMount () { this.context.onScrollTop() }

  static get contextTypes () { return {onScrollTop: propTypes.any} }
}
