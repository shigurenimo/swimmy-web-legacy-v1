import classNames from 'classnames'
import React from 'react'
import IconButton from 'material-ui/IconButton'
import { ListItem, ListItemSecondaryAction, ListItemText } from 'material-ui/List'
import withStyles from 'material-ui/styles/withStyles'
import BookmarkBorderIcon from 'material-ui-icons/BookmarkBorder'

export const Component = props =>
  <ListItem button dense
    className={classNames({
      [props.classes.select]: props.pathname.includes('release')
    })}
    component='a'
    href='/release'>
    <ListItemText primary='note' />
  </ListItem>

export const styles = {
  select: {
    background: 'rgba(0, 0, 0, 0.05)'
  }
}

export default withStyles(styles)(Component)
