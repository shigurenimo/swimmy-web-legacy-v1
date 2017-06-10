import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('Layout', theme => {
  return {
    container: {
      position: 'fixed',
      top: 0,
      right: 0,
      height: '100%',
      overflowY: 'scroll',
      overflowX: 'hidden'
    },
    twoColumn: {
      width: '100%'
    },
    oneColumn: {
      width: '200%'
    },
    left: {
      transform: 'translate3d(50%, 0, 0)'
    },
    right: {
      transform: 'translate3d(0, 0, 0)'
    },
    smartphone: {
      transition: 'translate3d 250ms'
    },
    smartphoneNot: {
      transition: 'translateX 0'
    }
  }
})
