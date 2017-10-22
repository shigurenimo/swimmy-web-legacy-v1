import classNames from 'classnames'
import withStyles from 'material-ui/styles/withStyles'
import ListItem from 'material-ui/List/ListItem'
import ListItemText from 'material-ui/List/ListItemText'
import React from 'react'

export const Component = props =>
  <ListItem
    button
    dense
    className={classNames({
      [props.classes.select]: props.pathname.includes('/media')
    })}
    onClick={props.onChangeRoute}>
    <ListItemText primary='メディア' />
  </ListItem>

export const styles = {
  select: {
    background: 'rgba(0, 0, 0, 0.05)'
  }
}

export default withStyles(styles)(Component)
