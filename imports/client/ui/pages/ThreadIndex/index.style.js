import { red } from 'material-ui/colors'

export default theme => {
  return {
    sheet: {
      borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
    },
    content: {
      color: 'rgba(0, 0, 0, 0.8)'
    },
    count: {
      display: 'inline',
      color: red['500']
    }
  }
}
