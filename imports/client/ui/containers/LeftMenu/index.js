import compose from 'ramda/src/compose'
import Divider from 'material-ui/Divider'
import withStyles from 'material-ui/styles/withStyles'
import Typography from 'material-ui/Typography'
import List from 'material-ui/List'
import { observer } from 'mobx-react'
import React from 'react'

import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'
import Sheet from '/imports/client/ui/components/UI-Sheet'
import SheetContent from '/imports/client/ui/components/UI-SheetContent'
import withRouter from '/imports/client/ui/hocs/withRouter'

import ListItemLogin from './ListItemLogin'
import ListItemNote from './ListItemNote'
import ListItemRepository from './ListItemRepository'
import ListItemStorage from './ListItemStorage'
import ListItemThread from './ListItemThread'
import ListItemTimeline from './ListItemTimeline'
import styles from './index.style'

export const Component = props =>
  <div className={props.classes.root}>
    <List>
      <ListItemLogin />
    </List>
    <Divider light />
    <List>
      <ListItemTimeline
        isExpand={props.isExpandChat}
        onExpand={props.onExpandChat}
        pathname={props.router.location.pathname} />
      <ListItemThread
        pathname={props.router.location.pathname} />
      <ListItemStorage
        pathname={props.router.location.pathname} />
      {/*
        props.isLogged &&
        props.accounts.profile.channels
        .map(item => <ListItemChannel {...props} item={item} />)
      */}
    </List>
    <Divider light />
    <List>
      <ListItemNote
        pathname={props.router.location.pathname} />
      <ListItemRepository
        pathname={props.router.location.pathname} />
    </List>
    <Sheet>
      <SheetContent>
        <Typography type='caption'>
          © 2016 - 2017 Sw I/O
        </Typography>
      </SheetContent>
    </Sheet>
  </div>

export const onExpandChat = props => () => { props.setIsExpandChat(!props.isExpandChat) }

export const onExpandUser = props => () => { props.setIsExpandUser(!props.isExpandUser) }

export default compose(
  withStyles(styles),
  withState('isExpandChat', 'setIsExpandChat', false),
  withState('isExpandUser', 'setIsExpandUser', false),
  withHandlers({onExpandChat, onExpandUser}),
  withRouter,
  observer
)(Component)
