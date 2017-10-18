import classNames from 'classnames'
import compose from 'ramda/src/compose'
import { ListItem, ListItemText } from 'material-ui/List'
import withStyles from 'material-ui/styles/withStyles'
import React from 'react'

import withRouter from '/imports/client/ui/hocs/withRouter'

export const Component = props =>
  <ListItem
    button
    dense
    className={classNames({
      [props.classes.select]: props.pathname.includes('instance')
    })}
    onClick={() => { props.router.push('/instance') }}>
    <ListItemText primary='instance' />
  </ListItem>

export const styles = {
  select: {
    background: 'rgba(0, 0, 0, 0.05)'
  }
}

export default compose(withStyles(styles), withRouter)(Component)
