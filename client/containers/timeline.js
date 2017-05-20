import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { NetworkInfo } from './network-info'
import { Post } from './post'

@inject('networks', 'posts', 'postsSocket')
@observer
class Timeline extends Component {
  render () {
    return <div className='container:timeline'>
      {this.props.posts.networkInfo &&
      <NetworkInfo/>}
      <div className='block:post-list'>
        {this.forPosts()}
      </div>
    </div>
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
      return <div className='block:no-post'>
        <div className='text:no-post'>
          {isFetching ? '読み込み中 ..' : ''}
        </div>
      </div>
    }
    return index.map(item => <Post key={item._id} {...item}/>)
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

export { Timeline }
