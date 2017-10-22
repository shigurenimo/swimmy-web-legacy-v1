import compose from 'ramda/src/compose'
import Divider from 'material-ui/Divider'
import withStyles from 'material-ui/styles/withStyles'
import Collapse from 'material-ui/transitions/Collapse'
import Typography from 'material-ui/Typography'
import List from 'material-ui/List'
import { observer, inject } from 'mobx-react'
import React from 'react'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'

import Sheet from '/imports/client/ui/components/Sheet'
import SheetContent from '/imports/client/ui/components/SheetContent'
import withRouter from '/imports/client/ui/hocs/withRouter'

import ListItemConfigUsername from './ListItemConfigUsername'
import ListItemConfigPassword from './ListItemConfigPassword'
import ListItemLogin from './ListItemLogin'
import ListItemMedia from './ListItemMedia'
import ListItemNote from './ListItemNote'
import ListItemRepository from './ListItemRepository'
import ListItemThread from './ListItemThread'
import ListItemTimeline from './ListItemTimeline'
import styles from './index.style'

export const Component = props =>
  <div className={props.classes.root}>
    <List>
      <ListItemLogin
        onChangeRoute={props.onChangeRoute('/admin')}
        isExpand={props.isExpandAccount}
        onExpand={props.onExpandAccount} />
      <Collapse in={props.isExpandAccount} transitionDuration='auto' unmountOnExit>
        <ListItemConfigUsername
          onChangeRoute={props.onChangeRoute('/config/username')}
          pathname={props.router.location.pathname} />
        <ListItemConfigPassword
          onChangeRoute={props.onChangeRoute('/config/password')}
          pathname={props.router.location.pathname} />
      </Collapse>
    </List>
    <Divider light />
    <List>
      <ListItemTimeline
        onChangeRoute={props.onChangeRoute('/')}
        isExpand={props.isExpandChat}
        onExpand={props.onExpandChat}
        pathname={props.router.location.pathname} />
      <ListItemThread
        onChangeRoute={props.onChangeRoute('/thread')}
        pathname={props.router.location.pathname} />
      <ListItemMedia
        onChangeRoute={props.onChangeRoute('/media')}
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
        onChangeRoute={props.onChangeRoute('/note')}
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

export const onExpandAccount = props => () => { props.setIsExpandAccount(!props.isExpandAccount) }

export const onChangeRoute = props => route => () => {
  props.router.push(route)
  props.drawer.close()
}

export default compose(
  withStyles(styles),
  inject(stores => ({drawer: stores.drawer})),
  withRouter,
  withState('isExpandAccount', 'setIsExpandAccount', false),
  withState('isExpandChat', 'setIsExpandChat', false),
  withHandlers({onExpandChat, onExpandAccount, onChangeRoute}),
  observer
)(Component)
