import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup'
import propTypes from 'prop-types'
import { Admin } from './admin'
import { ArtworkList } from './artwork-list'
import { ArtworkDetail } from './artwork-detail'
import { ArtworkNew } from './artwork-new'
import { ConfigAccount } from './config-account'
import { NetworkEdit } from './network-edit'
import { NetworkList } from './network-list'
import { NetworkNew } from './network-new'
import { Loading } from './loading'
import { Login } from './login'
import { NotFound } from './not-found'
import { Profile } from './profile'
import { Release } from './release'
import { Report } from './report'
import { Thread } from './thread'
import { ThreadList } from './thread-list'
import { TimeMachine } from './time-machine'
import { Timeline } from './timeline'
import { utils } from '../../imports/utils'

@inject('layout', 'inputPost', 'router', 'user')
@observer
class Content extends Component {
  render () {
    return <div className={this.className} style={{paddingTop: this.paddingTop}} ref='content'>
      <CSSTransitionGroup
        component='div'
        className='block:fix-height'
        transitionName='transition-content'
        transitionEnterTimeout={450}
        transitionLeaveTimeout={150}
        transitionAppear={true}
        transitionAppearTimeout={150}>
        {this.router()}
      </CSSTransitionGroup>
    </div>
  }

  get className () {
    return `container:content ${this.props.layout.oneColumnClassName}`
  }

  get paddingTop () {
    const fix = this.props.layout.oneColumn ? -10 : 0
    switch (this.props.router.page) {
      case 'timeline':
      case 'timemachine':
      case 'thread':
      case 'network-info':
        return this.props.inputPost.paddingTop + fix
      default:
        if (this.props.layout.oneColumn) {
          return 10
        } else {
          return 45
        }
    }
  }

  router () {
    if (this.props.router.page === null) {
      return <Loading key='loading'/>
    }
    switch (this.props.router.page) {
      case 'network-list':
        return <NetworkList key='network-list'/>
      case 'release':
        return <Release key='release'/>
      case 'not-found':
        return <NotFound key='not-found'/>
      case 'artwork':
        return <ArtworkList key='artwork'/>
      case 'report':
        return <Report key='report'/>
    }
    if (this.props.user.isLoggingIn) {
      return <Loading key='loading'/>
    }
    switch (this.props.router.page) {
      case 'profile':
        return <Profile key='profile'/>
      case 'artwork-detail':
        return <ArtworkDetail key='artwork-detail'/>
      case 'artwork-new':
        return <ArtworkNew key='artwork-new'/>
      case 'timeline':
        return <Timeline key='timeline'/>
      case 'timemachine':
        return <TimeMachine key='time-machine'/>
      case 'thread':
        return <Thread key='thread'/>
      case 'thread-list':
        return <ThreadList key='thread-list'/>
    }
    if (this.props.user.isNotLoggedIn) {
      return <Login key='login'/>
    }
    switch (this.props.router.page) {
      case 'admin':
        return <Admin key='admin'/>
      case 'config':
        return <ConfigAccount key='config-account'/>
      case 'network-edit':
        return <NetworkEdit key='network-edit'/>
      case 'network-new':
        return <NetworkNew key='network-new'/>
    }
    return null
  }

  componentDidMount () {
    // ↓ iOSのスクロールに対する処置
    const isSmartphone = utils.isSmartphone
    const element = this.refs.content
    // ↓ 初回時の修正
    setTimeout(() => {
      if (element.scrollTop === 0) {
        element.scrollTop = 1
      }
    }, 1000)
    if (isSmartphone) {
      setInterval(() => {
        if (element.scrollTop === 0) {
          element.scrollTop = 1
        }
      }, 1000)
    }
    const scrollEvent = () => {
      this.props.layout.setScrollOver(element.scrollTop)
      if (isSmartphone) {
        if (element.scrollTop === 0) {
          // スクロール上端のバグ補正
          element.scrollTop = 1
        } else if (element.scrollHeight - element.clientHeight > 2 &&
          element.scrollHeight - element.scrollTop - element.clientHeight === 0) {
          // スクロール下端のバグ補正
          element.scrollTop = element.scrollHeight - element.clientHeight - 1
        }
      }
    }
    try { // ↓ IE9+
      scrollEvent()
      element.addEventListener('scroll', scrollEvent, false)
    } catch (err) { // ↓ for IE8-
      scrollEvent()
      element.attachEvent('onscroll', scrollEvent)
    }
  }

  static get childContextTypes () {
    return {
      onScrollTop: propTypes.any
    }
  }

  getChildContext () {
    const self = this
    return {
      onScrollTop () {
        let scroll = 1
        switch (self.props.router.pageCache) {
          case 'network-info':
          case 'profile':
          case 'thread':
          case 'artwork-info':
            scroll = self.props.router.scrollCache
        }
        const element = document.querySelector('.container\\:content')
        setTimeout(() => { element.scrollTop = scroll }, 150)
      }
    }
  }
}

export { Content }
