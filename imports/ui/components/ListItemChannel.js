import classNames from 'classnames'
import React from 'react'
import { ListItem, ListItemText } from 'material-ui/List'
import withStyles from 'material-ui/styles/withStyles'

export const Component = props =>
  <ListItem button dense
    key={props.item._id}
    className={classNames({
      [props.classes.select]: props.pathname.includes(props.item._id)
    })}
    component='a'
    href={'/ch/' + props.item._id}>
    <ListItemText primary={props.item.name} />
  </ListItem>

export const styles = {
  select: {
    background: 'rgba(0, 0, 0, 0.05)'
  }
}

export default withStyles(styles)(Component)
