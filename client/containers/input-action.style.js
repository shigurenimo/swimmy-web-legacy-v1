import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('InputAction', theme => {
  return {
    inputLine: {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '100%',
      height: '10px',
      backgroundColor: '#F8F7F8',
      padding: '10px 10px 0 10px'
    },
    transitionEnter: {
      opacity: 0
    },
    transitionEnterActive: {
      opacity: 1,
      transitionDelay: '150ms',
      transitionDuration: '300ms'
    },
    transitionLeave: {
      opacity: 1
    },
    transitionLeaveActive: {
      opacity: 0,
      transitionDuration: '150ms'
    },
    transitionAppear: {
      opacity: 0
    },
    transitionAppearActive: {
      opacity: 1,
      transitionDuration: '150ms'
    }
  }
})
