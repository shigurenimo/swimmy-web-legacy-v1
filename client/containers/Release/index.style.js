import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('Release', theme => {
  return {
    version: {
      color: theme.palette.primary[500]
    }
  }
})
