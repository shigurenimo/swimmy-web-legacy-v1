import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('Snackbar', theme => {
  return {
    container: {
      position: 'fixed',
      margin: 'auto',
      padding: '10px',
      left: 0,
      right: 0,
      width: '100%',
      maxWidth: '600px',
      height: '50px',
      boxSizing: 'border-box',
      zIndex: 500,
      transitionDuration: '200ms',
      opacity: 0
    },
    inner: {
      height: '100%',
      backgroundColor: theme.palette.text.primary,
    },
    text: {
      textAlign: 'center',
      lineHeight: '30px',
      color: 'white'
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
