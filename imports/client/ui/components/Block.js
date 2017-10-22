import classNames from 'classnames'
import withStyles from 'material-ui/styles/withStyles'
import React from 'react'

export const Component = props => {
  const {
    classes,
    className,
    align = 'left',
    width,
    ...other
  } = props
  return (
    <div
      {...other}
      className={classNames(classes.root, {
        [className]: className
      })}>
      <div
        className={classes.inner}
        style={{
          margin: margin(align),
          maxWidth: width ? (width + 'px') : '600px'
        }}>
        {props.children}
      </div>
    </div>
  )
}

const margin = (align) => {
  switch (align) {
    case 'left':
      return '0 auto 0 0'
    case 'right':
      return '0 0 0 auto'
    case 'center':
      return '0 auto'
  }
}

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

export default withStyles(styles)(Component)
