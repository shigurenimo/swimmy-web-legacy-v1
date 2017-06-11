import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('Snackbar', theme => {
  return {
    container: {
      position: 'fixed',
      margin: 'auto',
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '45px',
      lineHeight: '45px',
      textAlign: 'center',
      backgroundColor: theme.palette.text.primary,
      color: 'white',
      zIndex: 500,
      transitionDuration: '200ms',
      opacity: 0
    },
    on: {
      opacity: 1,
      bottom: 0
    },
    off: {
      opacity: 1,
      bottom: '-50px'
    },
    minimal: {
      height: '35px',
      lineHeight: '35px'
    }
  }
})
