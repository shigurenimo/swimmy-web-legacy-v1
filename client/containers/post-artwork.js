import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'

@inject('artworks', 'snackbar', 'user')
@observer
class PostArtwork extends Component {
  render () {
    return <div className='container:post-work'>
      <div className='block:container-layout'>
        {/* ユーザ */}
        {this.props.public &&
        <div className='block:post-username'>
          <div className='text:public-name'>{this.props.public.name}</div>
          <div className='text:public-username'>@{this.props.public.username}</div>
        </div>}
        {/* イラスト */}
        <a className='block:artwork-image' href={'/uuid/' + this.props._id}>
          <img src={this.src}/>
        </a>
        {/* タイトル */}
        {this.props.title &&
        <div className='block:post-title'>{this.props.title}</div>}
        {/* ノート */}
        {this.props.note &&
        <div className='block:post-note' dangerouslySetInnerHTML={{__html: this.props.note}}/>}
        {/* リアクションボタン */}
        <div className='block:reaction-list'>
          {Object.keys(this.props.reactions).map(name =>
            <input
              className={'input:reaction ' +
              (!!this.props.user.isLogged && this.props.reactions[name].includes(this.props.user._id))}
              key={name}
              onTouchTap={this.onUpdateReaction.bind(this, this.props._id, name)}
              type='button'
              value={name + (this.props.reactions[name].length > 0 ? ' ' + this.props.reactions[name].length : '')}/>)}
        </div>
      </div>
    </div>
  }

  get src () {
    return Meteor.settings.public.assets.work.root +
      this.props.type + '/' +
      this.props.imageDate + '/' +
      this.props.image.min
  }

  // リアクションを更新する
  onUpdateReaction (postId, name) {
    if (!this.props.user.isLogged) {
      this.props.snackbar.requireLogin()
      return
    }
    this.props.artworks.updateReaction(postId, name)
    .then(post => {
      this.props.artworks.updateIndex(post._id, post)
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
  }
}

export { PostArtwork }
