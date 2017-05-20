import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { NetworkInfo } from './network-info'
import { Post } from '../containers/post'
import { PostRes } from './post-res'

@inject('posts', 'user')
@observer
class Thread extends Component {
  render () {
    if (!this.data) {
      return <div className='container:thread-detail'>
        <div className='block:no-post'>
          <div className='text:no-post'>
            {this.props.posts.isFetching ? '読み込み中 ..' : 'データが見つかりませんでした、'}
          </div>
        </div>
      </div>
    }
    return <div className='container:thread-detail'>
      {this.props.posts.networkInfo &&
      <NetworkInfo/>}
      <Post {...this.props.posts.one} isReply={true}/>
      {/* レス */}
      <div className='block:reply-list'>
        {this.data.replies &&
        this.data.replies.length > 0 &&
        this.data.replies.map(item => <PostRes key={item._id} {...item}/>)}
      </div>
    </div>
  }

  get data () {
    return this.props.posts.one
  }

  get src () {
    return Meteor.settings.public.assets.post.root +
      this.data.type + '/' +
      this.data.imageDate + '/' +
      this.data.image.full
  }

  reactionPlaceholder = [
    'エモい', 'それな', 'いいね', 'わかる', 'わぁ',
    'オトナ', '既読', '高まる', 'おやすん'
  ][Math.floor(Math.random() * 9)]

  state = {
    inputNewReaction: ''
  }

  process = false

  embed (data) {
    switch (data.provider_name) {
      case 'Vine':
      case 'SoundCloud':
        return <div
          className='block:oEmbed-iframe'
          dangerouslySetInnerHTML={{__html: data.html}}/>
      default:
        return <div
          className='block:oEmbed'
          dangerouslySetInnerHTML={{__html: data.html}}/>
    }
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
export { Thread }
