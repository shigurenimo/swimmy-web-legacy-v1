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

@inject('posts', 'user')
@observer
export default class Thread extends Component {
  render () {
    if (!this.data) {
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
        <Post {...this.props.posts.one} isReply />
        {this.data.replies &&
        this.data.replies.length > 0 &&
        this.data.replies.map(item => <PostRes key={item._id} {...item} />)}
      </Layout>
    )
  }

  get data () {
    return this.props.posts.one
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
