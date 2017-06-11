import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Layout from '../components/ui-layout'
import Sheet from '../components/ui-sheet'
import SheetContent from '../components/ui-sheet-content'
import NetworkInfo from './network-info'
import Post from './post'

@inject('networks', 'posts', 'postsSocket')
@observer
export default class Timeline extends Component {
  render () {
    return (
      <Layout className='container:timeline'>
        {this.props.posts.networkInfo &&
        <NetworkInfo />}
        {this.forPosts()}
      </Layout>
    )
  }

  forPosts () {
    const timeline = this.props.posts.timeline
    const index = timeline.isStatic
      ? this.props.posts.index.slice()
      : this.props.postsSocket.index.slice()
    const isFetching = timeline.isStatic
      ? this.props.posts.isFetching
      : this.props.postsSocket.isFetching
    if (index.length < 1) {
      return (
        <Sheet>
          <SheetContent>
            <Typography>
              {isFetching ? '読み込み中 ..' : ''}
            </Typography>
          </SheetContent>
        </Sheet>
      )
    }
    return index.map(item => <Post key={item._id} {...item} />)
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
