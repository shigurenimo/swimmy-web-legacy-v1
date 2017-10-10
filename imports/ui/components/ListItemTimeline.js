import classNames from 'classnames'
import React from 'react'
import { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import withStyles from 'material-ui/styles/withStyles'

import IconButtonMoreExpand from '/imports/ui/components/UI-IconButtonMoreExpand'

export const Component = props =>
  <ListItem
    button
    dense
    className={classNames({
      [props.classes.select]: props.pathname === '/'
    })}
    component='a'
    href='/'>
    <ListItemText primary='chat' />
    <ListItemSecondaryAction>
      <IconButtonMoreExpand isExpand={props.isExpand} onClick={props.onExpand} />
    </ListItemSecondaryAction>
  </ListItem>

export const styles = {
  select: {
    background: 'rgba(0, 0, 0, 0.05)'
  }
}

export default withStyles(styles)(Component)
