import withStyles from 'material-ui/styles/withStyles'
import React, { Component } from 'react'

class Layout extends Component {
  render () {
    const {classes} = this.props
    return (
      <div className={classes.root}>
        {this.props.children}
      </div>
    )
  }
}

export const styles = theme => {
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

export default withStyles(styles)(Layout)
