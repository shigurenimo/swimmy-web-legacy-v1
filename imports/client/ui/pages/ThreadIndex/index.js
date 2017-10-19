import withStyles from 'material-ui/styles/withStyles'
import Typography from 'material-ui/Typography'
import compose from 'ramda/src/compose'
import React, { Component } from 'react'

import Layout from '/imports/client/ui/components/Layout'
import Sheet from '/imports/client/ui/components/Sheet'
import SheetContent from '/imports/client/ui/components/SheetContent'
import withRouter from '/imports/client/ui/hocs/withRouter'
import withScrollTop from '/imports/client/ui/hocs/withScrollTop'
import withThreads from '/imports/client/ui/hocs/withThreads'
import toCreatedAt from '/imports/utils/date/toCreatedAt'
import toSince from '/imports/utils/date/toSince'

import styles from './index.style'

class ThreadIndex extends Component {
  render () {
    return (
      <Layout>
        {this.forThreads}
      </Layout>
    )
  }

  get forThreads () {
    const {classes} = this.props
    if (this.props.threads.data.length === 0) {
      return (
        <Sheet>
          <SheetContent>
            <Typography>
              {this.props.threads.loading ? '読み込み中 ..' : 'スレッドはありません'}
            </Typography>
          </SheetContent>
        </Sheet>
      )
    }
    return this.props.threads.data.map(item =>
      <Sheet
        hover
        key={item._id}
        className={classes.sheet}
        onClick={() => { this.props.router.push(`/thread/${item._id}`) }}>
        <SheetContent>
          <Typography className={classes.content}>
            {item.content}
            <span className={classes.count}> +{item.replies.length}</span>
          </Typography>
        </SheetContent>
        <SheetContent>
          <Typography type='caption'>
            {toCreatedAt(item.updatedAt)} - {toSince(item.updatedAt)}
          </Typography>
        </SheetContent>
      </Sheet>
    )
  }
}

export default compose(
  withStyles(styles),
  withRouter,
  withThreads(),
  withScrollTop
)(ThreadIndex)
