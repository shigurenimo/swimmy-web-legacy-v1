import withStyles from 'material-ui/styles/withStyles'
import { observer } from 'mobx-react'
import compose from 'ramda/src/compose'
import React from 'react'

import InputPost from '/imports/client/ui/containers/InputPost'
import withCurrentUser from '/imports/client/ui/hocs/withCurrentUser'
import withRouter from '/imports/client/ui/hocs/withRouter'

import styles from './index.style'

export const Component = props => {
  if (props.isLoggingIn) return null
  if (props.router.location.pathname.includes('thread/')) {
    return <InputPost />
  }
  switch (props.router.location.pathname) {
    case '/':
    case 'timeline':
    case 'timemachine':
    case 'thread':
    case 'channel-info':
      return <InputPost />
    default:
      return <div className={props.classes.line} />
  }
}

export default compose(
  withStyles(styles),
  withCurrentUser,
  withRouter,
  observer
)(Component)
