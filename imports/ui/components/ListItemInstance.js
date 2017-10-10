import classNames from 'classnames'
import React from 'react'
import { ListItem, ListItemText } from 'material-ui/List'
import withStyles from 'material-ui/styles/withStyles'

export const Component = props =>
  <ListItem button dense
    className={classNames({
      [props.classes.select]: props.pathname.includes('instance')
    })}
    component='a'
    href='/instance'>
    <ListItemText primary='instance' />
  </ListItem>

export const styles = {
  select: {
    background: 'rgba(0, 0, 0, 0.05)'
  }
}

export default withStyles(styles)(Component)
