import React, { Component } from 'react'
import classNames from 'classnames'
import { withStyles } from 'material-ui/styles'

const styles = theme => {
  return {
    root: {
      paddingBottom: '10px',
      position: 'relative',
      display: 'block',
      width: '100%',
      textDecoration: 'none'
    }
  }
}

@withStyles(styles)
export default class UISheetContent extends Component {
  render () {
    const {
      classes,
      className,
      align,
      href,
      ...other
    } = this.props
    const Component = href ? 'a' : 'div'
    return (
      <Component
        {...other}
        className={classNames(classes.root, {[className]: className})}
        style={{
          textAlign: align || 'left'
        }}
        href={href}>
        {this.props.children}
      </Component>
    )
  }
}
