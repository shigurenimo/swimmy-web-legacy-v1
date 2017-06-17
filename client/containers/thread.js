import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Layout from '../components/ui-layout'
import Sheet from '../components/ui-sheet'
import SheetContent from '../components/ui-sheet-content'
import NetworkInfo from './network-info'
import Post from '../containers/post'
import PostRes from './post-res'

@inject('posts', 'users')
@observer
export default class Thread extends Component {
  render () {
    if (!this.props.posts.one) {
      return (
        <Layout>
          <Sheet>
            <SheetContent>
              <Typography>
                {this.props.posts.isFetching ? '読み込み中 ..' : 'データが見つかりませんでした、'}
              </Typography>
            </SheetContent>
          </Sheet>
        </Layout>
      )
    }
    return (
      <Layout>
        {this.props.posts.networkInfo &&
        <NetworkInfo />}
        <Post isReply {...this.props.posts.one} />
        {this.props.posts.one.replies &&
        this.props.posts.one.replies.length > 0 &&
        this.props.posts.one.replies.map(item => <PostRes key={item._id} {...item} />)}
      </Layout>
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
