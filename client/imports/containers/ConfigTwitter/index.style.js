import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('Twitter', theme => {
  return {
    icon: {
      display: 'block',
      margin: '0 auto',
      borderRadius: '50%',
      maxWidth: '280px'
    }
  }
})
