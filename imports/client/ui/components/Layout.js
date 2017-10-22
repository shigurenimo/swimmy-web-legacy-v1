import classNames from 'classnames'
import withStyles from 'material-ui/styles/withStyles'
import React, { Component } from 'react'

class Layout extends Component {
  render () {
    const {classes, dense} = this.props
    return (
      <div className={classNames(classes.root, {[classes.dense]: dense})}>
        {this.props.children}
      </div>
    )
  }
}

export const styles = theme => {
  return {
    root: {
      paddingLeft: 10,
      paddingRight: 10,
      [theme.breakpoints.up('md')]: {
        paddingBottom: 20
      },
      [theme.breakpoints.down('md')]: {
        paddingBottom: 100
      }
    },
    dense: {
      [theme.breakpoints.down('sm')]: {
        paddingLeft: 0,
        paddingRight: 0
      }
    }
  }
}

export default withStyles(styles)(Layout)
