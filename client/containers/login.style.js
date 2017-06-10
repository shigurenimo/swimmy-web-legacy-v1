import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('Login', theme => {
  return {
    appTitle: {
      position: 'relative',
      margin: '0 auto',
      maxWidth: '240px'
    },
    appVersion: {
      textAlign: 'center'
    },
    appName: {
      paddingTop: '10px',
      lineHeight: '30px',
      fontSize: '30px',
      textAlign: 'center',
      letterSpacing: '6px'
    }
  }
})
