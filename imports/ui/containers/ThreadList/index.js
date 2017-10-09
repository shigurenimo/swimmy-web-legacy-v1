import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Layout from '/imports/ui/components/UI-Layout'
import Sheet from '/imports/ui/components/UI-Sheet'
import SheetContent from '/imports/ui/components/UI-SheetContent'
import utils from '/imports/utils'
import styles from './index.style'

@withStyles(styles)
@inject('threads')
@observer
export default class ThreadList extends Component {
  render () {
    return (
      <Layout>
        {this.forThreads}
      </Layout>
    )
  }

  get threads () { return this.props.threads.model.get('root') }

  get forThreads () {
    const {classes} = this.props
    if (this.threads.isEmpty) {
      return (
        <Sheet>
          <SheetContent>
            <Typography>
              {this.threads.fetchState ? '読み込み中 ..' : ''}
            </Typography>
          </SheetContent>
        </Sheet>
      )
    }
    return this.threads.index.map(item =>
      <Sheet hover key={item._id} href={'/thread/' + item._id} className={classes.sheet}>
        <SheetContent>
          <Typography className={classes.content}>
            {item.content}
            <span className={classes.count}> +{item.replies.length}</span>
          </Typography>
        </SheetContent>
        <SheetContent>
          <Typography type='caption'>
            {utils.date.createdAt(item.updatedAt)} - {utils.date.since(item.updatedAt)}
          </Typography>
        </SheetContent>
      </Sheet>
    )
  }

  componentDidMount () { this.context.onScrollTop() }

  static get contextTypes () { return {onScrollTop: propTypes.any} }
}
