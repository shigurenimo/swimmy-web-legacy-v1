import compose from 'ramda/src/compose'
import { inject, observer } from 'mobx-react'
import withStyles from 'material-ui/styles/withStyles'
import propTypes from 'prop-types'
import React, { Component } from 'react'

class ContentPadding extends Component {
  render () {
    const {classes, children} = this.props
    return (
      <div
        className={classes.root}
        style={{paddingTop: this.paddingTop}}
        ref={self => { this.ref = self }}>
        <div className={classes.fixHeight}>
          {children}
        </div>
      </div>
    )
  }

  get paddingTop () {
    switch (this.props.router.location.pathname) {
      case '/':
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

const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    height: '100%',
    boxSizing: 'border-box',
    overflowY: 'auto',
    overflowX: 'hidden',
    transition: 'padding-top 300ms, width 0ms',
    '-webkit-overflow-scrolling': 'touch',
    [theme.breakpoints.down('sm')]: {
      right: '-20px',
      width: 'calc(50% + 20px)',
      paddingRight: '20px',
      paddingLeft: 0
    },
    [theme.breakpoints.up('sm')]: {
      right: '-20px',
      paddingRight: (0 + 20) + 'px',
      paddingLeft: 0,
      width: 'calc(100% - 250px + 20px)'
    }
  },
  fixHeight: {
    position: 'relative',
    width: '100%',
    height: '101%'
  }
})

export default compose(
  inject(stores => ({
    router: stores.router,
    inputPost: stores.inputPost,
    routes: stores.routes
  })),
  withStyles(styles),
  observer
)(ContentPadding)
