import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('Loading', theme => {
  return {
    container: {
      position: 'relative'
    },
    squares: {
      margin: '25% auto auto',
      width: '140px',
      height: '140px',
      borderRadius: '2px',
      opacity: '0.95'
    },
    square: {
      display: 'inline-block',
      verticalAlign: 'top',
      width: '20%',
      height: '20%',
      transitionDuration: '100ms'
    }
  }
})
