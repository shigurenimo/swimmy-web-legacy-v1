import Typography from 'material-ui/Typography'
import { inject, observer } from 'mobx-react'
import compose from 'ramda/src/compose'
import React, { Component } from 'react'

import Layout from '/imports/client/ui/components/Layout'
import Sheet from '/imports/client/ui/components/Sheet'
import SheetContent from '/imports/client/ui/components/SheetContent'
import ChannelInfo from '/imports/client/ui/containers/ChannelInfo'
import PostRes from '/imports/client/ui/containers/CardPost/CardRes'
import withPosts from '/imports/client/ui/hocs/withThreadPosts'
import withRouter from '/imports/client/ui/hocs/withRouter'
import withScrollTop from '/imports/client/ui/hocs/withScrollTop'

class Thread extends Component {
  render () {
    return (
      <Layout>
        {this.props.info.channel && <ChannelInfo />}
        {this.forPosts}
      </Layout>
    )
  }

  get forPosts () {
    if (this.props.posts.data.length === 0) {
      return (
        <Sheet>
          <SheetContent>
            <Typography>
              {this.props.posts.loading ? '読み込み中 ..' : ''}
            </Typography>
          </SheetContent>
        </Sheet>
      )
    }
    return this.props.posts.data.map(item => <PostRes key={item._id} {...item} />)
  }
}

export default compose(
  withRouter,
  withPosts({}, {}, 'thread'),
  withScrollTop,
  inject(stores => ({info: stores.info})),
  observer
)(Thread)
