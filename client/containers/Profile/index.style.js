import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('Profile', theme => {
  return {
    squares: {
      margin: '0 auto',
      width: '140px',
      height: '140px',
      borderEadius: '2px'
    },
    square: {
      display: 'inline-block',
      verticalAlign: 'top',
      width: '20%',
      height: '20%'
    },
    icon: {
      display: 'block',
      margin: '0 auto',
      borderRadius: '50%',
      maxWidth: '280px'
    }
  }
})
