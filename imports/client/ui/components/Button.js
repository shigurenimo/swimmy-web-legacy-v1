import classNames from 'classnames'
import withStyles from 'material-ui/styles/withStyles'
import MuiButton from 'material-ui/Button'
import React, { Component } from 'react'

class Button extends Component {
  render () {
    const {
      classes,
      selected,
      background,
      className,
      ...other
    } = this.props
    return (
      <MuiButton
        raised={selected}
        color={selected ? 'primary' : 'default'}
        {...other}
        className={classNames({
          [className]: className,
          [classes.background]: background
        })}>
        {this.props.children}
      </MuiButton>
    )
  }
}

export const styles = {
  background: {
    backgroundColor: 'rgba(0, 0, 0, 0.03)'
  }
}

export default withStyles(styles)(Button)