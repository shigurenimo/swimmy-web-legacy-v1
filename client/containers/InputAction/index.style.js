import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('InputAction', theme => {
  return {
    line: {
      position: 'fixed',
      top: 0,
      right: 0,
      width: '100%',
      height: '10px',
      backgroundColor: '#F8F7F8'
    }
  }
})
