import classNames from 'classnames'
import compose from 'ramda/src/compose'
import { ListItem, ListItemText } from 'material-ui/List'
import withStyles from 'material-ui/styles/withStyles'
import React from 'react'

export const Component = props =>
  <ListItem
    button
    dense
    className={classNames({
      [props.classes.select]: props.pathname.includes(props.item._id)
    })}
    onClick={() => { props.router.push(`/ch/${props.item._id}`) }}>
    <ListItemText primary={props.item.name} />
  </ListItem>

export const styles = {
  select: {
    background: 'rgba(0, 0, 0, 0.05)'
  }
}

export default compose(withStyles(styles))(Component)
