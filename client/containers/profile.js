import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { Post } from '../containers/post'

@inject('posts', 'snackbar', 'user', 'userOther')
@observer
class Profile extends Component {
  render () {
    return <div className='container:profile'>
      {/* アイコン */}
      <div className='block:user-icon'>
        <div className='block:squares'>
          {this.user.profile.code.map((i, index) =>
            <div
              className='block:square'
              key={index + '-' + i}
              style={{
                backgroundColor: i === '1'
                  ? Meteor.settings.public.color.primary
                  : i === '2' ? Meteor.settings.public.color.secondary : 'rgb(0 0 0)'
              }}/>)}
        </div>
      </div>
      {/* ネーム */}
      <div className='block:name'>
        <div className='text:username'>
          {this.user.username}
        </div>
        <div className='text:name'>
          {this.user.profile.name}
        </div>
      </div>
      {this.props.user.isLogged &&
      this.user.username !== this.props.user.username &&
      <div
        className='block:follow'
        onTouchTap={this.onFollow.bind(this, this.user.username)}>
        <div className='input:follow'>
          {this.followsIds.includes(this.user._id) ? 'フォローを外す' : 'フォローする'}
        </div>
      </div>}
      {/* 投稿 */}
      <div className='block:post-list'>
        {this.posts.map(item => <Post key={item._id} {...item}/>)}
      </div>
    </div>
  }

  get user () {
    return this.props.userOther.one
  }

  get posts () {
    const isNotFound = this.props.posts.index === null
    if (isNotFound) return null
    return this.props.posts.index.slice()
  }

  get followsIds () {
    return this.props.user.followsIds.slice()
  }

  onFollow () {
    this.props.user.updateFollow(this.user._id)
    .then(() => {
      this.props.snackbar.show('フォローを更新しました')
    })
    .catch(err => {
      this.props.snackbar.error(err)
    })
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

export { Profile }
