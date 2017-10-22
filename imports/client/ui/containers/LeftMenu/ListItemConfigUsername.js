import classNames from 'classnames'
import compose from 'ramda/src/compose'
import withStyles from 'material-ui/styles/withStyles'
import ListItem from 'material-ui/List/ListItem'
import ListItemText from 'material-ui/List/ListItemText'
import React from 'react'

import withCurrentUser from '/imports/client/ui/hocs/withCurrentUser'

export const Component = props =>
  <ListItem
    button
    dense
    className={classNames({
      [props.classes.select]: props.pathname.includes('/config/username')
    })}
    onClick={props.onChangeRoute}>
    <ListItemText inset primary={'ユーザネームの更新'} />
  </ListItem>

export const styles = {
  select: {
    background: 'rgba(0, 0, 0, 0.05)'
  }
}

export default compose(withStyles(styles), withCurrentUser)(Component)
