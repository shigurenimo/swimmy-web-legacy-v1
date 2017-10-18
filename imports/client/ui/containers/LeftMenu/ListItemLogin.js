import compose from 'ramda/src/compose'
import { ListItem, ListItemText } from 'material-ui/List'
import React from 'react'

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
  </ListItem>

export default compose(
  withRouter,
  withCurrentUser
)(Component)
