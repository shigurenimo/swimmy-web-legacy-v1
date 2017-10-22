import classNames from 'classnames'
import withStyles from 'material-ui/styles/withStyles'
import IconButton from 'material-ui/IconButton'
import ListItem from 'material-ui/List/ListItem'
import ListItemSecondaryAction from 'material-ui/List/ListItemSecondaryAction'
import ListItemText from 'material-ui/List/ListItemText'
import BookmarkBorderIcon from 'material-ui-icons/BookmarkBorder'
import React from 'react'

export const Component = props =>
  <ListItem
    button
    dense
    className={classNames({
      [props.classes.select]: props.pathname.includes('/thread')
    })}
    onClick={props.onChangeRoute}>
    <ListItemText primary='スレッド' />
    <ListItemSecondaryAction>
      <IconButton component='a' href='/thread'>
        <BookmarkBorderIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>

export const styles = {
  select: {
    background: 'rgba(0, 0, 0, 0.05)'
  }
}

export default withStyles(styles)(Component)
