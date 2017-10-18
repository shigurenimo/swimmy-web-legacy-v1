import classNames from 'classnames'
import withStyles from 'material-ui/styles/withStyles'
import Card from 'material-ui/Card'
import React, { Component } from 'react'

class Sheet extends Component {
  render () {
    const {
      classes,
      hover,
      background,
      className,
      ...other
    } = this.props
    return (
      <Card
        {...other}
        className={classNames(className, classes.root, {
          [classes.hover]: hover,
          [classes.background]: background
        })}>
        {this.props.children}
      </Card>
    )
  }
}

export const styles = {
  root: {
    background: 'rgba(0, 0, 0, 0)',
    border: 'none'
  },
  hover: {
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.05)'
    }
  },
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.02)'
  }
}

export default withStyles(styles)(Sheet)
