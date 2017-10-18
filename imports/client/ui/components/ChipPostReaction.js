import classNames from 'classnames'
import withStyles from 'material-ui/styles/withStyles'
import Chip from 'material-ui/Chip'
import React from 'react'

export const Component = props =>
  <Chip
    className={classNames(props.classes.chip, {
      [props.classes.colorChip]: props.ownerIds.includes(props.userId)
    })}
    label={label(props.name, props.ownerIds)}
    onClick={props.onUpdateReaction} />

export const label = (name, ownerIds) =>
  name + ' ' + (ownerIds.length > 0 ? ownerIds.length : '')

export const styles = theme => ({
  chip: {
    marginRight: '5px',
    background: 'rgba(0, 0, 0, 0.05)'
  },
  colorChip: {
    color: 'white',
    background: theme.palette.primary[500]
  }
})

export default withStyles(styles)(Component)
