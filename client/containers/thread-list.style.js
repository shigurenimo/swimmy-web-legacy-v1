import { createStyleSheet } from 'material-ui/styles'
import { red } from 'material-ui/styles/colors'

export default createStyleSheet('ThreadList', theme => {
  return {
    count: {
      display: 'inline',
      color: red['500']
    }
  }
})
