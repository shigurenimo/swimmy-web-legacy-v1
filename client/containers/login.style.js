import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('Login', theme => {
  return {
    appTitle: {
      color: theme.palette.primary[500]
    },
    appVersion: {
      color: theme.palette.primary[400]
    },
    appLogoImage: {
      display: 'block',
      margin: 'auto',
      width: '140px',
      height: 'auto'
    },
    AppPointTitle: {
      color: theme.palette.primary[500]
    }
  }
})
