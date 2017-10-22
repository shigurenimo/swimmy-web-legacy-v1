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
      [theme.breakpoints.up('sm')]: {
        paddingLeft: 10,
        paddingRight: 10
      },
      [theme.breakpoints.up('md')]: {
        paddingBottom: 20,
      },
      [theme.breakpoints.down('md')]: {
        paddingBottom: 100,
      }
    }
  }
}

export default withStyles(styles)(Layout)
