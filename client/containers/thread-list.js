import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { utils } from '../../imports/utils'

@inject('threads')
@observer
class ThreadList extends Component {
  render () {
    return <div className='container:thread-list'>
      <div className='block:thread-list'>
        {this.forThreads()}
      </div>
    </div>
  }

  forThreads () {
    const index = this.props.threads.index
    if (index.length < 1) {
      return <div className='block:no-post'>
        <div className='text:no-post'>
          {this.props.threads.isFetching ? '読み込み中 ..' : ''}
        </div>
      </div>
    }
    return index.map(item =>
      <a className='input:thread-item' key={item._id} href={'/thread/' + item._id}>
        <div className='text:thread-name'>
          {item.content}
          <div className='text:count'> +{item.replies.length}</div>
        </div>
        <div className='text:updatedAt'>
          {utils.date.createdAt(item.updatedAt)}
        </div>
        <div className='text:since'>
          {utils.date.since(item.updatedAt)}
        </div>
      </a>)
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

export { ThreadList }
