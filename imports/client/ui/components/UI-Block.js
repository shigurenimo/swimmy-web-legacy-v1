import classNames from 'classnames'
import withStyles from 'material-ui/styles/withStyles'
import React, { Component } from 'react'

const styles = {
  root: {
    display: 'block',
    width: '100%',
    borderBottom: 'none',
    transitionDuration: '200ms'
  },
  inner: {
    position: 'relative',
    margin: '0 auto'
  }
}

class Block extends Component {
  render () {
    const {
      classes,
      className,
      align = 'left',
      width,
      ...other
    } = this.props
    return (
      <Component {...other} className={classNames(className, classes.root)}>
        <div
          className={classes.inner}
          style={{
            margin: this.margin(align),
            maxWidth: width ? (width + 'px') : '600px'
          }}>
          {this.props.children}
        </div>
      </Component>
    )
  }

  margin (align) {
    switch (align) {
      case 'left':
        return '0 auto 0 0'
      case 'right':
        return '0 0 0 auto'
      case 'center':
        return '0 auto'
    }
  }
}

export default withStyles(styles)(Block)
