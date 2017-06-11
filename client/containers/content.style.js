import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('Content', theme => {
  return {
    container: {
      position: 'absolute',
      top: 0,
      height: '100%',
      boxSizing: 'border-box',
      overflowY: 'auto',
      overflowX: 'hidden',
      transition: 'padding-top 300ms, width 300ms'
    },
    twoColumn: {
      right: '-20px',
      paddingRight: (10 + 20) + 'px',
      paddingLeft: 0,
      width: 'calc(100% - 250px + 20px)'
    },
    oneColumn: {
      right: '-20px',
      width: 'calc(50% + 20px)',
      paddingRight: '20px',
      paddingLeft: 0
    },
    fixHeight: {
      position: 'relative',
      width: '100%',
      height: '101%'
    },
    transitionEnter: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '100%',
      height: '100%',
      opacity: 0
    },
    transitionEnterActive: {
      opacity: 1,
      transitionDelay: '150ms',
      transitionDuration: '300ms'
    },
    transitionLeave: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: '100%',
      height: '100%',
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
