import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'
import Admin from '../Admin'
import ConfigAccount from '../ConfigAccount'
import ChannelEdit from '../ChannelEdit'
import ChannelList from '../ChannelList'
import ChannelNew from '../ChannelNew'
import Loading from '../Loading'
import Login from '../Login'
import NotFound from '../NotFound'
import Profile from '../Profile'
import Release from '../Release'
import Report from '../Report'
import Thread from '../Thread'
import ThreadList from '../ThreadList'
import Timeline from '../Timeline'
import Twitter from '../ConfigTwitter'
import TwitterLogin from '../ConfigTwitterLogin'
import utils from '/lib/imports/utils'
import styleSheet from './index.style'

@withStyles(styleSheet)
@inject('layout', 'inputPost', 'routes', 'accounts')
@observer
export default class Content extends Component {
  render () {
    const {classes, layout} = this.props
    return (
      <div
        className={classNames(classes.container, {
          [classes.oneColumn]: layout.oneColumn,
          [classes.twoColumn]: !layout.oneColumn
        })}
        style={{paddingTop: this.paddingTop}}
        ref={self => { this.ref = self }}>
        <div className={classes.fixHeight}>
          {this.router()}
        </div>
      </div>
    )
  }

  get paddingTop () {
    const fix = this.props.layout.oneColumn ? 0 : 0
    switch (this.props.routes.page) {
      case 'timeline':
      case 'logs':
      case 'thread':
      case 'channel-info':
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
    if (this.props.accounts.isLoggingIn) {
      return <Loading key='loading' />
    }
    if (this.props.routes.page === null) {
      return <Loading key='loading' />
    }
    switch (this.props.routes.page) {
      case 'channel-list':
        return <ChannelList key='channel-list' />
      case 'release':
        return <Release key='release' />
      case 'not-found':
        return <NotFound key='not-found' />
      case 'artwork':
      case 'report':
        return <Report key='report' />
    }
    switch (this.props.routes.page) {
      case 'profile':
        return <Profile key='profile' />
      case 'timeline':
        return <Timeline key={'timeline'} />
      case 'thread':
        return <Thread key='thread' />
      case 'thread-list':
        return <ThreadList key='thread-list' />
    }
    if (this.props.accounts.isNotLoggedIn) {
      return <Login key='login' />
    }
    switch (this.props.routes.page) {
      case 'admin':
        return <Admin key='admin' />
      case 'config':
        return <ConfigAccount key='config-account' />
      case 'channel-edit':
        return <ChannelEdit key='channel-edit' />
      case 'channel-new':
        return <ChannelNew key='channel-new' />
      case 'twitter':
        if (this.props.accounts.one.services) {
          if (this.props.accounts.one.services.twitter) {
            return <Twitter key='twitter' />
          } else {
            return <TwitterLogin key='twitter' />
          }
        } else {
          return <Loading key='loading' />
        }
    }
    return null
  }

  componentDidMount () {
    // ↓ iOSのスクロールに対する処置
    const isSmartphone = utils.isSmartphone
    const element = this.ref
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
      console.error(err)
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
        switch (self.props.routes.pageCache) {
          case 'channel-info':
          case 'profile':
          case 'thread':
          case 'artwork-info':
            scroll = self.props.routes.scrollCache
        }
        setTimeout(() => {
          const element = self.ref
          element.scrollTop = scroll
        }, 150)
      }
    }
  }
}
