import withStyles from 'material-ui/styles/withStyles'
import React from 'react'

import colors from '/imports/config/colors'

export const Component = props =>
  <div className={props.classes.squares}>
    {props.code.map((i, index) =>
      <div
        className={props.classes.square}
        key={index + '-' + i}
        style={{backgroundColor: createBackgroundColor(i)}} />
    )}
  </div>

export const createBackgroundColor = i => i === '1'
  ? colors.primary
  : i === '2'
    ? colors.secondary
    : 'rgb(0 0 0)'

export const styles = {
  squares: {
    width: '140px',
    height: '140px',
    borderEadius: '2px'
  },
  square: {
    display: 'inline-block',
    verticalAlign: 'top',
    width: '20%',
    height: '20%'
  }
}

export default withStyles(styles)(Component)
