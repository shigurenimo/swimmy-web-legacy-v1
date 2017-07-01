import React, { Component } from 'react'
import { createStyleSheet, withStyles } from 'material-ui/styles'
import IconButton from 'material-ui/IconButton'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import classNames from 'classnames'

export const styleSheet = createStyleSheet('UIIconButtonMoreExpand', theme => {
  return {
    expand: {
      transform: 'rotate(0deg)',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest
      })
    },
    expandOpen: {
      transform: 'rotate(180deg)'
    }
  }
})

@withStyles(styleSheet)
export default class IconButtonMoreExpand extends Component {
  render () {
    const {isExpand, classes} = this.props
    return (
      <IconButton
        className={classNames(
          classes.expand,
          {[classes.expandOpen]: isExpand}
        )}
        onClick={this.props.onClick}>
        <ExpandMoreIcon />
      </IconButton>
    )
  }
}
