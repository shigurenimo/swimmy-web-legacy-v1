import classNames from 'classnames'
import ListItem from 'material-ui/List/ListItem'
import ListItemText from 'material-ui/List/ListItemText'
import withStyles from 'material-ui/styles/withStyles'
import React from 'react'

export const Component = props =>
  <ListItem
    button
    dense
    className={classNames({
      [props.classes.select]: props.pathname.includes('note')
    })}
    onClick={props.onChangeRoute}>
    <ListItemText primary='開発ノート' />
  </ListItem>

export const styles = {
  select: {
    background: 'rgba(0, 0, 0, 0.05)'
  }
}

export default withStyles(styles)(Component)
