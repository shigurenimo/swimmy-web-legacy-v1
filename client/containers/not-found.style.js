import { createStyleSheet } from 'material-ui/styles'

export default createStyleSheet('NotFound', theme => {
  return {
    container: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      width: 200,
      height: 100,
      margin: 'auto'
    }
  }
})
