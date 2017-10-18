import classNames from 'classnames'
import withStyles from 'material-ui/styles/withStyles'
import MuiTypography from 'material-ui/Typography'
import React, { Component } from 'react'

class Typography extends Component {
  render () {
    const {
      classes,
      className,
      children,
      inline,
      ...other
    } = this.props
    return (
      <MuiTypography
        {...other}
        className={classNames(this.props.classes.root, {
          [className]: className,
          [classes.inline]: inline
        })}>
        {children}
      </MuiTypography>
    )
  }
}

export const styles = {
  inline: {
    display: 'inline'
  }
}

export default withStyles(styles)(Typography)
