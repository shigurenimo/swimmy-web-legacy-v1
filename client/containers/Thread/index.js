import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import Layout from '/client/components/UI-Layout'
import Sheet from '/client/components/UI-Sheet'
import SheetContent from '/client/components/UI-SheetContent'
import ChannelInfo from '../ChannelInfo'
import PostRes from '../CardPost/CardRes'

@inject('posts', 'accounts', 'info')
@observer
export default class Thread extends Component {
  render () {
    if (!this.props.posts.thread.index.length === 0) {
      return (
        <Layout>
          <Sheet>
            <SheetContent>
              <Typography>
                {this.props.thread.fetchState ? '読み込み中 ..' : 'データが見つかりませんでした、'}
              </Typography>
            </SheetContent>
          </Sheet>
        </Layout>
      )
    }
    return (
      <Layout>
        {this.props.info.channel && <ChannelInfo />}
        {this.props.posts.thread.index.map(item => {
          return <PostRes key={item._id} {...item} />
        })}
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
