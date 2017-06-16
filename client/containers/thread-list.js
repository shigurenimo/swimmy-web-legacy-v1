import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Layout from '../components/ui-layout'
import Sheet from '../components/ui-sheet'
import SheetContent from '../components/ui-sheet-content'
import utils from '/utils'
import styleSheet from './thread-list.style'

@withStyles(styleSheet)
@inject('threads')
@observer
export default class ThreadList extends Component {
  render () {
    return (
      <Layout>
        <div className='block:thread-list'>
          {this.forThreads()}
        </div>
      </Layout>
    )
  }

  forThreads () {
    const {classes} = this.props
    const index = this.props.threads.index
    if (index.length < 1) {
      return (
        <Sheet>
          <SheetContent>
            <Typography>
              {this.props.threads.isFetching ? '読み込み中 ..' : ''}
            </Typography>
          </SheetContent>
        </Sheet>
      )
    }
    return index.map(item =>
      <Sheet hover key={item._id} href={'/thread/' + item._id}>
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

  componentDidMount () {
    this.context.onScrollTop()
  }

  static get contextTypes () {
    return {
      onScrollTop: propTypes.any
    }
  }
}
