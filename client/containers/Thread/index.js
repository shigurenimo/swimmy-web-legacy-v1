import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetContent from '../../components/UI-SheetContent'
import NetworkInfo from '../NetworkInfo'
import Post from '../CardPost'
import PostRes from '../CardPost/CardRes'

@inject('posts', 'accounts') @observer
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
        {this.props.posts.networkId && <NetworkInfo />}
        {this.props.posts.one.replies &&
        this.props.posts.one.replies.length > 0 &&
        this.props.posts.one.replies.map(item => <PostRes key={item._id} {...item} />)}
        <Post isReply {...this.props.posts.one} />
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
