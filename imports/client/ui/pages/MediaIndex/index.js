import compose from 'ramda/src/compose'
import React, { Component } from 'react'

import Layout from '/imports/client/ui/components/Layout'
import NowLoading from '/imports/client/ui/components/NowLoading'
import CardImage from '/imports/client/ui/containers/CardImage/index'
import withMedia from '/imports/client/ui/hocs/withMedia'
import withRouter from '/imports/client/ui/hocs/withRouter'
import withScrollTop from '/imports/client/ui/hocs/withScrollTop'

class Timeline extends Component {
  render () {
    return (
      <Layout>
        {this.forPosts}
      </Layout>
    )
  }

  get forPosts () {
    if (this.props.posts.data.length === 0) {
      return this.props.posts.loading && <NowLoading />
    }
    return this.props.posts.data.map(item => <CardImage key={item._id} {...item} />)
  }
}

export default compose(
  withRouter,
  withMedia(),
  withScrollTop
)(Timeline)
