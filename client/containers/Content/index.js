import { inject, observer } from 'mobx-react'
import React, { Component } from 'react'
import propTypes from 'prop-types'
import { withStyles } from 'material-ui/styles'
import Admin from '../Admin'
import BucketList from '../BucketList'
import ConfigAccount from '../ConfigAccount'
import ChannelEdit from '../ChannelEdit'
import ChannelList from '../ChannelList'
import ChannelNew from '../ChannelNew'
import Explore from '../Explore'
import Loading from '../Loading'
import Login from '../Login'
import NotFound from '../NotFound'
import Profile from '../Profile'
import Release from '../Release'
import Report from '../Report'
import Storage from '../Storage'
import Thread from '../Thread'
import ThreadList from '../ThreadList'
import Timeline from '../Timeline'
import Twitter from '../ConfigTwitter'
import TwitterLogin from '../ConfigTwitterLogin'
import utils from '/lib/imports/utils'
import styles from './index.style'

@withStyles(styles)
@inject('inputPost', 'routes', 'accounts')
@observer
export default class Content extends Component {
  render () {
    const {classes} = this.props
    return (
      <div
        className={classes.root}
        style={{paddingTop: this.paddingTop}}
        ref={self => { this.ref = self }}>
        <div className={classes.fixHeight}>
          {this.router()}
        </div>
      </div>
    )
  }

  get paddingTop () {
    switch (this.props.routes.page) {
      case 'timeline':
      case 'logs':
      case 'thread':
      case 'channel-info':
        return this.props.inputPost.paddingTop
      case 'explore':
        return 58
      default:
        return 10
    }
  }

  router () {
    if (this.props.accounts.isLoggingIn) { return <Loading /> }
    if (this.props.routes.page === null) { return <Loading /> }
    switch (this.props.routes.page) {
      case 'channel-list':
        return <ChannelList />
      case 'release':
        return <Release />
      case 'not-found':
        return <NotFound />
      case 'report':
        return <Report />
    }
    switch (this.props.routes.page) {
      case 'explore':
        return <Explore />
      case 'profile':
        return <Profile />
      case 'timeline':
        return <Timeline />
      case 'thread':
        return <Thread />
      case 'thread-list':
        return <ThreadList />
      case 'storage':
        return <Storage />
    }
    if (this.props.accounts.isNotLoggedIn) { return <Login /> }
    switch (this.props.routes.page) {
      case 'admin':
        return <Admin />
      case 'bucket-list':
        return <BucketList />
      case 'config':
        return <ConfigAccount />
      case 'channel-edit':
        return <ChannelEdit />
      case 'channel-new':
        return <ChannelNew />
      case 'twitter':
        if (this.props.accounts.services) {
          if (this.props.accounts.services.twitter) {
            return <Twitter />
          } else {
            return <TwitterLogin />
          }
        } else {
          return <Loading />
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
