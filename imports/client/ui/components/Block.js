import classNames from 'classnames'
import withStyles from 'material-ui/styles/withStyles'
import React from 'react'

export const Block = props => {
  const {
    classes,
    className,
    align = 'left',
    width,
    padding,
    ...other
  } = props
  return (
    <div
      {...other}
      className={classNames(classes.root, {
        [className]: className,
        [classes.padding]: padding
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
    transitionDuration: '200ms',
    padding: '10px',
    boxSizing: 'border-box'
  },
  inner: {
    position: 'relative',
    margin: '0 auto'
  }
}

export default withStyles(styles)(Block)
