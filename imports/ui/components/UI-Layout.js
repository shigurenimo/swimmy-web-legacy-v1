import React, { Component } from 'react'
import { withStyles } from 'material-ui/styles'

const styles = theme => {
  return {
    root: {
      paddingBottom: 20,
      [theme.breakpoints.up('sm')]: {
        paddingLeft: 10,
        paddingRight: 10
      }
    }
  }
}

@withStyles(styles)
export default class UILayout extends Component {
  render () {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        {this.props.children}
      </div>
    )
  }
}
