import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import { PostArtwork } from './post-artwork'

@inject('artworks', 'user')
@observer
class ArtworkList extends Component {
  render () {
    return <div className='container:artwork-list'>
      <div className='block:post-list' ref='focus'>
        {this.forPosts()}
      </div>
    </div>
  }

  forPosts () {
    const index = this.props.artworks.index.slice()
    const isFetching = this.props.artworks.isFetching
    if (index.length < 1) {
      return <div className='block:no-post'>
        <div className='text:no-post'>
          {isFetching ? '読み込み中 ..' : 'データが見つかりませんでした'}
        </div>
      </div>
    }
    return index.map(item => <PostArtwork key={item._id} {...item}/>)
  }

  componentDidMount () {
    this.context.onScrollTop()
  }

  static get contextTypes () {
    return {
      onScrollTop: React.PropTypes.any
    }
  }
}

export { ArtworkList }
