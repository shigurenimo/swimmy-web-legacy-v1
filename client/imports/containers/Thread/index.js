import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Layout from '../../components/UI-Layout'
import Sheet from '../../components/UI-Sheet'
import SheetContent from '../../components/UI-SheetContent'
import ChannelInfo from '../ChannelInfo'
import Post from '../CardPost'
import PostRes from '../CardPost/CardRes'

@inject('threads', 'accounts', 'info') @observer
export default class Thread extends Component {
  render () {
    if (!this.props.threads.one) {
      return (
        <Layout>
          <Sheet>
            <SheetContent>
              <Typography>
                {this.props.threads.fetchState ? '読み込み中 ..' : 'データが見つかりませんでした、'}
              </Typography>
            </SheetContent>
          </Sheet>
        </Layout>
      )
    }
    return (
      <Layout>
        {this.props.info.channel && <ChannelInfo />}
        {this.props.threads.one.replies &&
        this.props.threads.one.replies.length > 0 &&
        this.props.threads.one.replies.map(item => {
          return <PostRes key={item._id} {...item} />
        })}
        <Post isReply {...this.props.threads.one} />
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
