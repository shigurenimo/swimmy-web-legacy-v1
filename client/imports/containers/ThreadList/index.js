import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Typography from 'material-ui/Typography'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetContent from '../../components/UI-SheetContent'
import utils from '/lib/imports/utils'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('threads')
@observer
export default class ThreadList extends Component {
  render () {
    return (
      <Layout>
        {this.forThreads()}
      </Layout>
    )
  }

  forThreads () {
    const {classes} = this.props
    if (this.props.threads.isEmpty) {
      return (
        <Sheet>
          <SheetContent>
            <Typography>
              {this.props.threads.fetchState ? '読み込み中 ..' : ''}
            </Typography>
          </SheetContent>
        </Sheet>
      )
    }
    return this.props.threads.index.map(item =>
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
