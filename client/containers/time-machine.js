import { Meteor } from 'meteor/meteor'
import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import IconNext from 'material-ui/svg-icons/image/navigate-next'
import IconBefore from 'material-ui/svg-icons/image/navigate-before'
import { Post } from './post'

@inject('networks', 'posts', 'postsSocket')
@observer
class TimeMachine extends Component {
  render () {
    return <div className='container:time-machine'>
      <div className='block:form-title'>
        <div className='block:center'>
          <div className='block:center-text'>
            <div className='text:year'>{this.state.currentYear}</div>
            <div className='text:slash'>{'・'}</div>
            <div className='text:month'>{this.state.currentMonth}</div>
          </div>
          <button className='icon:before' onTouchTap={this.onBeforeMonth.bind(this)}>
            <IconBefore {...this.iconStyle}/>
          </button>
          <button className='icon:next' onTouchTap={this.onNextMonth.bind(this)}>
            <IconNext {...this.iconStyle}/></button>
        </div>
      </div>
      <div className='block:form-day'>
        <div className='block:center'>
          <div className='block:center-text'>
            <div className='text:day'>
              {this.state.currentDay}
            </div>
          </div>
          <button className='icon:before' onTouchTap={this.onBeforeDay.bind(this)}>
            <IconBefore {...this.iconStyle}/>
          </button>
          <button className='icon:next' onTouchTap={this.onNextDay.bind(this)}>
            <IconNext {...this.iconStyle}/></button>
        </div>
      </div>
      <div className='block:form-submit'>
        <a className='input:submit' href={this.href}>fetch !</a>
      </div>
      <div className='block:post-list'>
        {this.forPosts()}
      </div>
    </div>
  }

  get iconStyle () {
    return {
      style: {
        display: 'block',
        width: 30,
        height: 30
      },
      color: Meteor.settings.public.color.primary
    }
  }

  get href () {
    return '/timemachine/' +
      this.state.currentYear + '/' +
      this.state.currentMonth + '/' +
      this.state.currentDay
  }

  state = {
    currentYear: this.props.posts.timeline.other.y,
    currentMonth: this.props.posts.timeline.other.m,
    currentDay: this.props.posts.timeline.other.d
  }

  onBeforeMonth (event) {
    if (event) event.preventDefault()
    if (this.state.currentMonth < 1) {
      this.setState({currentMonth: 12, currentDay: 1})
    } else {
      this.setState({currentMonth: this.state.currentMonth - 1, currentDay: 1})
    }
  }

  onNextMonth (event) {
    if (event) event.preventDefault()
    if (this.state.currentMonth > 11) {
      this.setState({currentMonth: 1, currentDay: 1})
    } else {
      this.setState({currentMonth: this.state.currentMonth + 1, currentDay: 1})
    }
  }

  onBeforeDay (event) {
    if (event) event.preventDefault()
    const count = new Date(2017, this.state.currentDay - 1, 0).getDate()
    if (this.state.currentDay < 2) {
      this.setState({currentDay: count})
      this.onBeforeMonth()
    } else {
      this.setState({currentDay: this.state.currentDay - 1})
    }
  }

  onNextDay (event) {
    if (event) event.preventDefault()
    const count = new Date(2017, this.state.currentDay - 1, 0).getDate()
    if (this.state.currentDay > count - 1) {
      this.setState({currentDay: 1})
      this.onNextMonth()
    } else {
      this.setState({currentDay: this.state.currentDay + 1})
    }
  }

  forPosts () {
    const index = this.props.posts.index.slice()
    const isFetching = this.props.posts.isFetching
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
      onScrollTop: React.PropTypes.any
    }
  }
}

export { TimeMachine }
