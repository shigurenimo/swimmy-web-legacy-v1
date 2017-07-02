import { createStyleSheet } from 'material-ui/styles'
import { red } from 'material-ui/styles/colors'

export default createStyleSheet('ThreadList', theme => {
  return {
    content: {
      color: 'rgba(0, 0, 0, 0.8)'
    },
    count: {
      display: 'inline',
      color: red['500']
    }
  }
})
