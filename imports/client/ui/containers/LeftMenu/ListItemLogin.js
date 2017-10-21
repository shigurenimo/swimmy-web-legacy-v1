import compose from 'ramda/src/compose'
import withStyles from 'material-ui/styles/withStyles'
import ListItem from 'material-ui/List/ListItem'
import ListItemSecondaryAction from 'material-ui/List/ListItemSecondaryAction'
import ListItemText from 'material-ui/List/ListItemText'
import React from 'react'

import IconButtonMoreExpand from '/imports/client/ui/components/IconButtonMoreExpand'
import withRouter from '/imports/client/ui/hocs/withRouter'
import withCurrentUser from '/imports/client/ui/hocs/withCurrentUser'

export const Component = props =>
  <ListItem
    button
    dense
    onClick={() => { props.router.push('/admin') }}>
    {props.isLoggingIn
      ? <ListItemText primary={'async...'} />
      : <ListItemText primary={props.isLogged ? 'アカウント' : 'ログイン'} />}
    {props.isLogged &&
    <ListItemSecondaryAction>
      <IconButtonMoreExpand isExpand={props.isExpand} onClick={props.onExpand} />
    </ListItemSecondaryAction>}
  </ListItem>

export const styles = {
  select: {
    background: 'rgba(0, 0, 0, 0.05)'
  }
}

export default compose(
  withStyles(styles),
  withRouter,
  withCurrentUser
)(Component)
