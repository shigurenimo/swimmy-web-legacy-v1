import { Meteor } from 'meteor/meteor'
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'

@inject('posts', 'user')
@observer
class Admin extends Component {
  render () {
    return <div className='container:admin'>
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
      <div className='block:follow-list'>
        {this.forFollows()}
      </div>
    </div>
  }

  get user () {
    return this.props.user.info
  }

  forFollows () {
    const index = this.props.user.follows.slice()
    if (index.length < 1) {
      return null
    }
    return index.map(user =>
      <a className='block:follow-user' key={user._id} href={'/' + user.username}>
        <div className='text:name'>{user.name}</div>
        <div className='text:username'>@{user.username}</div>
      </a>)
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

export { Admin }
