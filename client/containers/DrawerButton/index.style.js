import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('DrawersButton', theme => {
  return {
    root: {
      position: 'fixed',
      right: 20,
      bottom: 20,
      zIndex: 200,
      [theme.breakpoints.up('sm')]: {
        display: 'none'
      }
    },
    button: {
      margin: theme.spacing.unit,
      color: 'white'
    }
  }
})
