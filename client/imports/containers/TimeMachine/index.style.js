import { Meteor } from 'meteor/meteor'
import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('TimeMachine', theme => {
  return {
    year: {
      lineHeight: '30px'
    },
    month: {
      lineHeight: '30px',
      fontSize: '2rem'
    },
    day: {
      lineHeight: '30px',
      fontSize: '4rem'
    },
    dot: {
      padding: '0 10px'
    },
    next: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: '0',
      margin: 'auto',
      width: '30px',
      height: '30px',
      cursor: 'pointer'
    },
    prev: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '0',
      margin: 'auto',
      width: '30px',
      height: '30px',
      cursor: 'pointer'
    },
    icon: {
      display: 'block',
      width: 30,
      height: 30,
      color: Meteor.settings.public.color.primary
    }
  }
})
